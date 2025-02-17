const express = require("express");
const connectDB = require("./src/config/db");
const { apiRouter } = require("./src/routes");
var cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://movie-ticket-booking-app-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const port = process.env.PORT;


app.use(cookieParser());

connectDB();

app.use((req, res, next) => {
  console.log("Working");
  next();
});

app.get("/", (req, res) => {
  res.send("Api Working");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
