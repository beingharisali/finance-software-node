
const Category = require("../models/Category"); // Category model schema with { name: String }

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).select("name -_id");
    res.json({ success: true, categories: categories.map(c => c.name) });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch categories" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ success: false, msg: "Category name required" });

    // Avoid duplicate
    const exists = await Category.findOne({ name: categoryName });
    if (exists) return res.json({ success: false, msg: "Category already exists" });

    await Category.create({ name: categoryName });
    res.json({ success: true, msg: "Category added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to add category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await Category.deleteOne({ name: categoryName });
    res.json({ success: true, msg: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to delete category" });
  }
};

module.exports = { getCategories, addCategory, deleteCategory };
