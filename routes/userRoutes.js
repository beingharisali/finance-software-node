
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

// Admin + Manager can create users
router.post("/", authenticateUser, allowRoles("admin", "manager"), createUser);

// Admin + Manager can fetch users
router.get("/", authenticateUser, allowRoles("admin", "manager"), getUsers);

// Admin can update users
router.put("/:id", authenticateUser, allowRoles("admin"), updateUser);

// Admin can delete users
router.delete("/:id", authenticateUser, allowRoles("admin"), deleteUser);

module.exports = router;
