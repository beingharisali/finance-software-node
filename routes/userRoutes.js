const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const { createUser, getUsers } = require("../controllers/userController");

router.post("/", authenticateUser, createUser);

router.get("/", authenticateUser, getUsers);

module.exports = router;
