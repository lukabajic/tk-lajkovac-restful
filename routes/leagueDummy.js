const express = require("express");

const leagueDummyController = require("../controllers/leagueDummy");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.put("/create", isAuth, isAdmin, leagueDummyController.createDummyUser);

router.get("/get-dummy", isAuth, isAdmin, leagueDummyController.getDummyUser);

router.get("/get-all", isAuth, isAdmin, leagueDummyController.getAllDummyUsers);

router.post(
  "/edit",
  isAuth,
  isAdmin,
  leagueDummyController.updateDummyUserData
);

router.delete(
  "/delete",
  isAuth,
  isAdmin,
  leagueDummyController.deleteDummyUser
);

module.exports = router;
