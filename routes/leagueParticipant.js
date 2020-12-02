const express = require("express");

const leagueParticipantController = require("../controllers/leagueParticipant");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.put(
  "/create",
  isAuth,
  isAdmin,
  leagueParticipantController.addParticipant
);

router.get("/get", isAuth, leagueParticipantController.getParticipant);

router.get("/get-all", isAuth, leagueParticipantController.getAllParticipants);

router.post(
  "/edit",
  isAuth,
  isAdmin,
  leagueParticipantController.editParticipant
);

router.delete(
  "/delete",
  isAuth,
  isAdmin,
  leagueParticipantController.deleteParticipant
);

module.exports = router;
