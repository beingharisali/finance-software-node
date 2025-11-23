const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const { getTransactions ,  addCustomCategory, deleteCustomCategory } = require("../controllers/transactionController");

router.get("/", authenticateUser, getTransactions);

// Add custom category
router.post("/add-category", authenticateUser, addCustomCategory);

// Delete custom category
router.delete("/delete-category", authenticateUser, deleteCustomCategory);
// router.get("/", authenticateUser, getTransactions);
// // NEW ROUTE FOR CUSTOM CATEGORY
// router.post("/add-category", authenticateUser, addCustomCategory);

// // DELETE custom category
// //  send { categoryName: "CategoryToDelete" } in request body
// router.delete("/delete-category", authenticateUser, deleteCustomCategory);
module.exports = router;
