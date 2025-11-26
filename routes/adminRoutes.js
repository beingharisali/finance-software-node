const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { getFinanceData, getSalesData } = require("../controllers/dataController");

// Finance page → admin & manager
router.get("/finance", auth, allowRoles("admin", "manager"), getFinanceData);

// Sales page → admin, manager, assistant, broker
router.get("/sales", auth, allowRoles("admin", "manager", "assistant", "broker"), getSalesData);

// Create User → admin & manager
router.post("/users", auth, allowRoles("admin", "manager"), createUser);
