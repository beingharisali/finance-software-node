
const Transaction = require("../models/Transaction");

// GET TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 20 } = req.query;
    let filter = {};

    if (category && category.trim() !== "") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      transactions,
      page: parseInt(page),
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to fetch transactions" });
  }
};

//  ADD CUSTOM CATEGORY (Permanent)
exports.addCustomCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category is required" });
    }

    // Check if category already exists (any transaction)
    const exists = await Transaction.findOne({ category: categoryName });
    if (exists) {
      return res.status(200).json({ success: true, msg: "Category already saved" });
    }

    // Create placeholder transaction to save category permanently
    await Transaction.create({
      date: new Date(),
      description: "Custom Category",
      category: categoryName,
      amount: 0,
    });

    res.status(201).json({
      success: true,
      msg: "Custom category saved successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to save category" });
  }
};

// DELETE CUSTOM CATEGORY (All Transactions)
exports.deleteCustomCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category is required" });
    }

    // Delete all transactions in this category (including placeholder)
    const deleted = await Transaction.deleteMany({ category: categoryName });

    res.status(200).json({
      success: true,
      msg: `Category "${categoryName}" and all its transactions deleted successfully`,
      deletedCount: deleted.deletedCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to delete category" });
  }
};
