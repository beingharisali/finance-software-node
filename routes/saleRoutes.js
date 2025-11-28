
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authentication");
// const allowRoles = require("../middleware/roleMiddleware");
// const { createSale, getSales, deleteSale } = require("../controllers/saleController");

// // Create Sale → admin, manager, agent
// router.post("/", auth, allowRoles("admin", "manager", "agent"), createSale);

// // Get Sales → admin, manager, agent
// router.get("/", auth, allowRoles("admin", "manager", "agent"), getSales);

// // Delete Sale → admin, manager only
// router.delete("/:id", auth, allowRoles("admin", "manager"), deleteSale);

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { createSale, getSales, updateSale, deleteSale } = require("../controllers/saleController");

// Create Sale → all roles can create
router.post("/", auth, allowRoles("admin", "manager", "agent", "broker"), createSale);

// Get Sales → admin/manager/all agents
router.get("/", auth, allowRoles("admin", "manager", "agent", "broker"), getSales);

// Update Sale → all roles (checks ownership inside controller)
router.put("/:id", auth, allowRoles("admin", "manager", "agent", "broker"), updateSale);

// Delete Sale → all roles (checks ownership inside controller)
router.delete("/:id", auth, allowRoles("admin", "manager", "agent", "broker"), deleteSale);

module.exports = router;
