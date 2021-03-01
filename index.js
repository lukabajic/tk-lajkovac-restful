const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

require("dotenv").config();

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const leagueRoutes = require("./routes/league");
const leagueGroupRoutes = require("./routes/leagueGroup");
const leagueParticipantRoutes = require("./routes/leagueParticipant");
const leagueDummyRoutes = require("./routes/leagueDummy");
const scheduleDayRoutes = require("./routes/scheduleDay");
const courtScheduleRoutes = require("./routes/courtSchedule");

// util
const { midnightUpdateSchedule } = require("./controllers/scheduleDay");
const { midnightUpdateUsers } = require("./controllers/user");

// where to run server
const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

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
cron.schedule("30 19 * * *", () => {
  midnightUpdateSchedule();
  midnightUpdateUsers();
});

// use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/league", leagueRoutes);
app.use("/api/v1/league/group", leagueGroupRoutes);
app.use("/api/v1/league/participant", leagueParticipantRoutes);
app.use("/api/v1/league/dummy", leagueDummyRoutes);
app.use("/api/v1/schedule-day", scheduleDayRoutes);
app.use("/api/v1/court-schedule", courtScheduleRoutes);

mongoose
  .connect(MONGO_URL, options)
  .then(() => {
    const server = app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on ${ROOT_URL}`);
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected.");
    });
  })
  .catch((err) => console.log(err));
