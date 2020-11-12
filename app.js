const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// where to run server
const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;

const app = express();

// database options
const MONGO_URL = process.env.MONGO_URL;
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

// parses all incoming json data
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

mongoose
  .connect(MONGO_URL, options)
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on ${ROOT_URL}`);
    });
  })
  .catch((err) => console.log(err));
