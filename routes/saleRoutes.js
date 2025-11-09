const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  createSale,
  getMySales,
  deleteSale,
} = require("../controllers/saleController");

router.post("/", authenticateUser, createSale);
router.get("/", authenticateUser, getMySales);
router.delete("/:id", authenticateUser, deleteSale);

module.exports = router;
