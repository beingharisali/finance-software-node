
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware"); 
const { register, login, getProfile } = require("../controllers/auth");

// ---------------------------
// REGISTER → Only Admin
// ---------------------------
router.post("/register", auth, allowRoles("admin"), register);
// router.post("/register", register);  // No auth required for now

// ---------------------------
// LOGIN → Anyone
// ---------------------------
router.post("/login", login);

// ---------------------------
// GET PROFILE → Authorized Roles
// ---------------------------
router.get(
  "/profile",
  auth,
  allowRoles("admin", "manager","assistant", "broker"), 
  getProfile
);

module.exports = router;
