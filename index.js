const express = require("express");
const connectDB = require("./src/config/db");
const { apiRouter } = require("./src/routes");
var cookieParser = require("cookie-parser");
var cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use((req, res, next) => {
  console.log("Working");
  next();
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
