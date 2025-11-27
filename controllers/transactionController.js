

// const Transaction = require("../models/Transaction");
// const { v4: uuidv4 } = require("uuid"); // for generating unique transactionId

// // ---------------------- GET TRANSACTIONS ----------------------
// exports.getTransactions = async (req, res) => {
//   try {
//     const { category, startDate, endDate, page = 1, limit = 20 } = req.query;
//     let filter = {};

//     // Filter by category (transactionType)
//     if (category && category.trim() !== "") {
//       filter.transactionType = { $regex: category.trim(), $options: "i" };
//     }

//     // Filter by date range
//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) filter.transactionDate.$gte = new Date(startDate);
//       if (endDate) filter.transactionDate.$lte = new Date(endDate);
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const transactions = await Transaction.find(filter)
//       .sort({ transactionDate: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalCount = await Transaction.countDocuments(filter);
//     const totalPages = Math.ceil(totalCount / parseInt(limit));

//     res.status(200).json({
//       success: true,
//       transactions,
//       page: parseInt(page),
//       totalPages,
//       totalCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, msg: "Failed to fetch transactions" });
//   }
// };

// // ---------------------- ADD CUSTOM CATEGORY ----------------------
// exports.addCustomCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;

//     if (!categoryName || categoryName.trim() === "") {
//       return res.status(400).json({ success: false, msg: "Category is required" });
//     }

//     const cleanCategory = categoryName.trim();

//     // Check if category exists
//     const exists = await Transaction.findOne({ transactionType: cleanCategory });
//     if (exists) {
//       return res.status(200).json({ success: true, msg: "Category already exists" });
//     }

//     // Create a placeholder transaction to save the category
//     await Transaction.create({
//       transactionId: uuidv4(),
//       transactionDate: new Date(),
//       transactionDescription: "Custom Category Placeholder",
//       transactionType: cleanCategory,
//       amount: 0,
//       sortCode: "",
//       accountNumber: "",
//       balance: 0,
//     });

//     res.status(201).json({
//       success: true,
//       msg: "Custom category saved successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, msg: "Failed to add category" });
//   }
// };

// // ---------------------- DELETE CUSTOM CATEGORY ----------------------
// exports.deleteCustomCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;

//     if (!categoryName || categoryName.trim() === "") {
//       return res.status(400).json({ success: false, msg: "Category is required" });
//     }

//     const deleted = await Transaction.deleteMany({ transactionType: categoryName.trim() });

//     res.status(200).json({
//       success: true,
//       msg: `Category "${categoryName}" and all its transactions deleted successfully`,
//       deletedCount: deleted.deletedCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, msg: "Failed to delete category" });
//   }
// };

const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");

// ---------------------- GET TRANSACTIONS ----------------------
exports.getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 20 } = req.query;
    let filter = {};

    // Filter by category (transactionType)
    if (category && category.trim() !== "") {
      filter.transactionType = { $regex: category.trim(), $options: "i" };
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(filter)
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

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

// ---------------------- ADD CUSTOM CATEGORY ----------------------
exports.addCustomCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category is required" });
    }

    const cleanCategory = categoryName.trim();

    // Check if category exists in any transaction
    const exists = await Transaction.findOne({ transactionType: cleanCategory });
    if (exists) {
      return res.status(200).json({ success: true, msg: "Category already exists" });
    }

    // Create a placeholder transaction to save the category
    await Transaction.create({
      transactionId: uuidv4(),
      transactionDate: new Date(),
      transactionDescription: "Custom Category Placeholder",
      transactionType: cleanCategory,
      amount: 0,
      sortCode: "",
      accountNumber: "",
      balance: 0,
    });

    res.status(201).json({
      success: true,
      msg: "Custom category saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to add category" });
  }
};

// ---------------------- DELETE CUSTOM CATEGORY ----------------------
exports.deleteCustomCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category is required" });
    }

    const deleted = await Transaction.deleteMany({ transactionType: categoryName.trim() });

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

// ---------------------- UPDATE TRANSACTION CATEGORY ----------------------
exports.updateTransactionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category || category.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category is required" });
    }

    const txn = await Transaction.findByIdAndUpdate(
      id,
      { transactionType: category.trim() },
      { new: true }
    );

    if (!txn) {
      return res.status(404).json({ success: false, msg: "Transaction not found" });
    }

    res.status(200).json({ success: true, msg: "Category updated", transaction: txn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Error updating category" });
  }
};
