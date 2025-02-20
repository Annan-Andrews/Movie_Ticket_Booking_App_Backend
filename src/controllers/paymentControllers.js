const Booking = require("../models/bookingModel");
const theaterModel = require("../models/theaterModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const client_domain = process.env.CLIENT_DOMAIN;

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleDetails, selectedSeats, totalPrice } = req.body;

    if (!scheduleDetails || !selectedSeats || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const seats = selectedSeats.map((seat) => ({ seatId: seat.seatId }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: scheduleDetails.schedule.movieId.title,
              images: [scheduleDetails.schedule.movieId.image],
              description: `Seats: ${selectedSeats
                .map((seat) => seat.seatId)
                .join(", ")}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${client_domain}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${client_domain}/user/payment/cancel`,
      metadata: {
        userId,
        selectedSeats: selectedSeats.map((seat) => seat.seatId).join(", "),
        totalPrice: totalPrice,
      },
    });

    const newBooking = new Booking({
      userId,
      scheduleDetails,
      seats,
      totalPrice,
      sessionId: session.id,
    });
    await newBooking.save();

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const PaymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const booking = await Booking.findOne({ sessionId: session_id }).populate(
      "userId",
      "name email"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const seatUpdate = await theaterModel.updateOne(
      {
        "movieSchedules._id": booking.scheduleDetails.schedule._id,
      },
      {
        $set: {
          "movieSchedules.$[schedule].seats.$[elem].isBooked": true,
          "movieSchedules.$[schedule].seats.$[elem].bookedBy":
            booking.userId._id,
        },
      },
      {
        arrayFilters: [
          { "schedule._id": booking.scheduleDetails.schedule._id },
          { "elem.seatId": { $in: booking.seats.map((s) => s.seatId) } },
        ],
      }
    );

    if (seatUpdate.modifiedCount === 0) {
      return res.status(500).json({ message: "Seat update failed" });
    }

    const bookingUpdate = await Booking.findOneAndUpdate(
      { sessionId: session_id },
      { $set: { bookingStatus: "Confirmed" } },
      { new: true }
    );

    if (!bookingUpdate) {
      return res.status(500).json({ message: "Booking confirmation failed" });
    }

    // Return booking details with stored scheduleDetails
    res.status(200).json({data : {
      movie: {
        title: booking.scheduleDetails.schedule.movieId.title,
        image: booking.scheduleDetails.schedule.movieId.image,
      },
      schedule: {
        date: booking.scheduleDetails.schedule.showDate,
        time: booking.scheduleDetails.schedule.showTime,
      },
      selectedSeats: booking.seats.map((seat) => seat.seatId),
      transactionId: booking.sessionId,
    }, message: "Booking Details fetched"});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { checkout, PaymentSuccess };
