// const express = require("express");
// const router = express.Router();
// const authenticateUser = require("../middleware/authentication");
// const {
//   createSale,
//   getMySales,
//   deleteSale,
// } = require("../controllers/saleController");

// router.post("/", authenticateUser, createSale);
// router.get("/", authenticateUser, getMySales);
// router.delete("/:id", authenticateUser, deleteSale);

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { createSale, getMySales, deleteSale } = require("../controllers/saleController");

// Create Sale → Admin, Manager, Broker
router.post("/", auth, allowRoles("admin", "manager", "broker"), createSale);

// Get My Sales → Admin, Manager, Broker
router.get("/", auth, allowRoles("admin", "manager", "broker"), getMySales);

// Delete Sale → Admin + Manager only
router.delete("/:id", auth, allowRoles("admin", "manager"), deleteSale);

module.exports = router;
