
// const Category = require("../models/Category"); // Category model schema with { name: String }

// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({}).select("name -_id");
//     res.json({ success: true, categories: categories.map(c => c.name) });
//   } catch (err) {
//     res.status(500).json({ success: false, msg: "Failed to fetch categories" });
//   }
// };

// const addCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;
//     if (!categoryName) return res.status(400).json({ success: false, msg: "Category name required" });

//     // Avoid duplicate
//     const exists = await Category.findOne({ name: categoryName });
//     if (exists) return res.json({ success: false, msg: "Category already exists" });

//     await Category.create({ name: categoryName });
//     res.json({ success: true, msg: "Category added successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, msg: "Failed to add category" });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;
//     await Category.deleteOne({ name: categoryName });
//     res.json({ success: true, msg: "Category deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, msg: "Failed to delete category" });
//   }
// };

// module.exports = { getCategories, addCategory, deleteCategory };
const Category = require("../models/Category"); // Category model schema with { name: String }

// ---------------------- GET ALL CATEGORIES ----------------------
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).select("name -_id");
    res.json({ success: true, categories: categories.map(c => c.name) });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch categories" });
  }
};

// ---------------------- ADD CATEGORY ----------------------
const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName)
      return res.status(400).json({ success: false, msg: "Category name required" });

    // Avoid duplicate
    const exists = await Category.findOne({ name: categoryName });
    if (exists) return res.json({ success: false, msg: "Category already exists" });

    await Category.create({ name: categoryName });
    res.json({ success: true, msg: "Category added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to add category" });
  }
};

// ---------------------- DELETE CATEGORY ----------------------
const deleteCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await Category.deleteOne({ name: categoryName });
    res.json({ success: true, msg: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to delete category" });
  }
};

// ---------------------- UPDATE CATEGORY ----------------------
const updateCategory = async (req, res) => {
  try {
    const { oldCategoryName, newCategoryName } = req.body;

    if (!oldCategoryName || !newCategoryName)
      return res.status(400).json({ success: false, msg: "Both old and new category names are required" });

    // Check if new name already exists
    const exists = await Category.findOne({ name: newCategoryName });
    if (exists)
      return res.status(400).json({ success: false, msg: "New category name already exists" });

    const updated = await Category.findOneAndUpdate(
      { name: oldCategoryName },
      { name: newCategoryName },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, msg: "Old category not found" });

    res.json({ success: true, msg: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to update category" });
  }
};

module.exports = { getCategories, addCategory, deleteCategory, updateCategory };
