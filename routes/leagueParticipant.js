const express = require("express");

const leagueParticipantController = require("../controllers/leagueParticipant");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.put("/create", isAuth, leagueParticipantController.createParticipant);

router.get("/get", isAuth, leagueParticipantController.getParticipant);

router.get("/get-all", isAuth, leagueParticipantController.getAllParticipants);

router.post("/edit", isAuth, leagueParticipantController.editParticipant);

router.delete("/delete", isAuth, leagueParticipantController.deleteParticipant);

module.exports = router;
