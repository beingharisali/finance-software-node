const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionDate: { type: Date, required: true },
    transactionDescription: { type: String, required: true },
    transactionType: { type: String, required: true },
    category: { type: String, default: "" },
    amount: { type: Number, required: true },
    sortCode: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Transaction", transactionSchema);
