const express = require("express");

const router = express.Router();

const {
    testController,
    signupController,
    loginController,
    saveHistoryController,
    getHistoryController,
} = require("../controllers/temp.js");

router.get("/test", testController);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/save-history", saveHistoryController);
router.get("/history/:userId", getHistoryController);

module.exports = router;