// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();

const {
  getCategories,
  addCategory,
  deleteCategory,
  renameCategory,
} = require("../controllers/categoryController");

// ---------------------- GET ALL CATEGORIES ----------------------
router.get("/", getCategories);

// ---------------------- ADD NEW CATEGORY ----------------------
router.post("/add", addCategory);

// ---------------------- DELETE CATEGORY ----------------------
router.delete("/delete", deleteCategory);

// ---------------------- RENAME CATEGORY ----------------------
router.put("/rename", renameCategory);

module.exports = router;
