const express = require("express");

const leagueGroupController = require("../controllers/leagueGroup");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.put("/create", isAuth, leagueGroupController.createGroup);

router.get("/get", isAuth, leagueGroupController.getGroup);

router.get("/get-all", isAuth, leagueGroupController.getAllGroups);

router.post("/edit", isAuth, leagueGroupController.editGroup);

router.delete("/delete", isAuth, leagueGroupController.deleteGroup);

module.exports = router;
