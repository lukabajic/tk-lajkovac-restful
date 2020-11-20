const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

require("dotenv").config();

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const scheduleRoutes = require("./routes/schedule");

// util
const { midnightUpdateSchedule } = require("./controllers/schedule");
const { midnightUpdateUser } = require("./controllers/user");

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

// DB daily updates
cron.schedule("0 0 * * *", () => {
  midnightUpdateSchedule();
  midnightUpdateUser();
});

// use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/schedule", scheduleRoutes);

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
