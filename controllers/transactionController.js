

const Transaction = require("../models/Transaction");

// ---------------------- GET TRANSACTIONS ----------------------
exports.getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 20 } = req.query;
    let filter = {};

    // Filter by category
   
    if (category && category.trim() !== "") {
  filter.$or = [
    { category: { $regex: category.trim(), $options: "i" } },
    { transactionType: { $regex: category.trim(), $options: "i" } },
  ];
}

    // Filter by date range
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch transactions
    let transactions = await Transaction.find(filter)
      .sort({ transactionDate: 1})
      .skip(skip)
      .limit(parseInt(limit));

    // ------------------- SET DEFAULT CATEGORY IF EMPTY -------------------
    transactions = transactions.map(txn => ({
      ...txn._doc,
      category:
        txn.category && txn.category.trim() !== ""
          ? txn.category
          : txn.transactionDescription || "Uncategorised",
    }));

    // ------------------- OPTIONAL: PERMANENTLY UPDATE DB -------------------
    const bulkOps = transactions
      .filter(txn => !txn.category || txn.category === "")
      .map(txn => ({
        updateOne: {
          filter: { _id: txn._id },
          update: { category: txn.transactionDescription },
        },
      }));

    if (bulkOps.length > 0) {
      await Transaction.bulkWrite(bulkOps);
    }

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

    const clean = categoryName.trim();

    const exists = await Transaction.findOne({ category: clean });

    if (exists) {
      return res.status(200).json({
        success: true,
        msg: "Category already exists",
      });
    }

    res.status(201).json({
      success: true,
      msg: "Category added successfully",
      category: clean,
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

    const oldName = categoryName.trim();

    const updated = await Transaction.updateMany(
      { category: oldName },
      { $set: { category: "" } } // reset category
    );

    res.status(200).json({
      success: true,
      msg: `Category "${oldName}" deleted & transactions updated`,
      affected: updated.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to delete category" });
  }
};

// ---------------------- RENAME CATEGORY ----------------------
exports.renameCategory = async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({ success: false, msg: "Both old and new names are required" });
    }

    const cleanNew = newName.trim();

    const updated = await Transaction.updateMany(
      { category: oldName.trim() },
      { category: cleanNew }
    );

    res.status(200).json({
      success: true,
      msg: "Category renamed",
      updatedCount: updated.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to rename category" });
  }
};

// ---------------------- UPDATE TRANSACTION CATEGORY ONLY OR FUTURE ----------------------
exports.updateTransactionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, applyToFuture = false } = req.body;

    if (!category || category.trim() === "") {
      return res.status(400).json({ success: false, msg: "Category required" });
    }

    const cleanCategory = category.trim();

    // Update only this transaction
    const txn = await Transaction.findByIdAndUpdate(
      id,
      { category: cleanCategory },
      { new: true }
    );

    if (!txn) {
      return res.status(404).json({ success: false, msg: "Transaction not found" });
    }

    // Apply to all future transactions with same description
    if (applyToFuture) {
      await Transaction.updateMany(
        { transactionDescription: txn.transactionDescription, _id: { $ne: id } },
        { category: cleanCategory }
      );
    }

    res.status(200).json({
      success: true,
      msg: "Transaction category updated",
      transaction: txn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Error updating transaction category" });
  }
};
