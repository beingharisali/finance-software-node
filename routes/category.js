const express = require("express");
const router = express.Router();
const {
  getCategories, addCategory, deleteCategory ,
} = require("../controllers/Category");

router.get("/", getCategories);

// Add new category
router.post("/add", addCategory);

// Delete category
router.delete("/delete", deleteCategory);

module.exports = router;
