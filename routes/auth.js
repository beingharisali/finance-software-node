
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware"); // <- ye missing tha
const { register, login, getProfile } = require("../controllers/auth");

// Register → sirf Admin
router.post("/register", auth, allowRoles("admin"), register);
router.post("/login", login);
router.get("/profile", auth, getProfile,allowRoles("admin", "manager", "assistant", "broker"), getProfile);

module.exports = router;
