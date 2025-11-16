const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
   try {
    // frontend se ?category=office wala value ayegi
    const { category, page = 1, limit = 20 } = req.query;
    let filter = {};


    if (category && category.trim() !== "") {
      filter.category = { $regex: category, $options: "i" }; 
    }
 
   const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit));
    const totalCount = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);


    res.status(200).json({ success: true, transactions, page: parseInt(page),  totalPages,  totalCount, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to fetch transactions" });
  }
};
