
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Admin + Manager + Assistant can create users
// Backend controller will enforce which roles each can actually create
router.post("/", authenticateUser, allowRoles("admin", "manager", "assistant"), createUser);

// Admin + Manager + Assistant can fetch users
router.get("/", authenticateUser, allowRoles("admin", "manager", "assistant"), getUsers);

// Admin can update users
router.put("/:id", authenticateUser, allowRoles("admin"), updateUser);

// Admin can delete users
router.delete("/:id", authenticateUser, allowRoles("admin"), deleteUser);

module.exports = router;
