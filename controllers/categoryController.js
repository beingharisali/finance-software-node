// controllers/categoryController.js
let categoryList = ["Food", "Transport", "Bills", "Shopping"]; // can also save in DB

// GET categories
exports.getCategories = (req, res) => {
  res.status(200).json({ success: true, categories: categoryList });
};

// ADD category
exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, msg: "Category name required" });
  }
  if (categoryList.includes(name.trim())) {
    return res.status(200).json({ success: true, msg: "Category already exists" });
  }
  categoryList.push(name.trim());
  res.status(201).json({ success: true, msg: "Category added", category: name.trim() });
};

// DELETE category
exports.deleteCategory = (req, res) => {
  const { name } = req.body;
  categoryList = categoryList.filter((c) => c !== name);
  res.status(200).json({ success: true, msg: "Category deleted" });
};

// RENAME category
exports.renameCategory = (req, res) => {
  const { oldName, newName } = req.body;
  categoryList = categoryList.map((c) => (c === oldName ? newName : c));
  res.status(200).json({ success: true, msg: "Category renamed" });
};
