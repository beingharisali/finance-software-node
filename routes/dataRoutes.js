// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const allowRoles = require("../middleware/roleMiddleware");
// const { getFinanceData, getSalesData } = require("../controllers/dataController");

// // Finance → Admin + Manager only
// router.get("/finance", auth, allowRoles("admin", "manager"), getFinanceData);

// // Sales → Admin, Manager, Assistant, Broker
// router.get("/sales", auth, allowRoles("admin", "manager", "assistant", "broker"), getSalesData);

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { getFinanceData, getSalesData } = require("../controllers/dataController");

// Finance → Admin + Manager only
router.get("/finance", auth, allowRoles("admin", "manager"), getFinanceData);

// Sales → Admin, Manager, Assistant, Broker
router.get("/sales", auth, allowRoles("admin", "manager", "assistant", "broker"), getSalesData);

module.exports = router;
