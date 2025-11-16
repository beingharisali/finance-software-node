const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
   try {
    // frontend se ?category=office wala value ayegi
    const { category } = req.query;
    let filter = {};


    if (category && category.trim() !== "") {
      filter.category = { $regex: category, $options: "i" }; 
    }
 
   
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to fetch transactions" });
  }
};
