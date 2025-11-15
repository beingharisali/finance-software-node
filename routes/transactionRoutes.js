const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const { getTransactions } = require("../controllers/transactionController");

router.get("/", authenticateUser, getTransactions);

module.exports = router;
