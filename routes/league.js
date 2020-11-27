const express = require("express");

const leagueController = require("../controllers/league");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.put("/create", isAuth, isAdmin, leagueController.createLeague);

router.get("/get", isAuth, isAdmin, leagueController.getLeague);

router.get("/get-all", isAuth, isAdmin, leagueController.getAllLeagues);

router.post("/edit", isAuth, isAdmin, leagueController.editLeague);

router.delete("/delete", isAuth, isAdmin, leagueController.deleteLeague);

module.exports = router;
