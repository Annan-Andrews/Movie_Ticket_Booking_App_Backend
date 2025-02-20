const express = require('express');
const { checkout, PaymentSuccess } = require('../controllers/paymentControllers');
const userAuth = require('../middleware/userAuth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();


const client_domain = process.env.CLIENT_DOMAIN;

router.post("/create-checkout-session", userAuth, checkout);

router.get("/success", userAuth, PaymentSuccess)


module.exports = { paymentRouter: router };