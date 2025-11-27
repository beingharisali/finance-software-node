
// // const mongoose = require("mongoose");

// // const transactionSchema = new mongoose.Schema(
// //   {
// //     transactionDate: { type: Date, required: true },
// //     transactionDescription: { type: String, required: true },
// //     transactionType: { type: String, required: true },
// //     amount: { type: Number, required: true },
// //     sortCode: { type: String, default: "" },
// //     accountNumber: { type: String, default: "" },
// //     balance: { type: Number, default: 0 },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Transaction", transactionSchema);
// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema(
//   {
//     transactionDate: { type: Date, required: true },
//     transactionDescription: { type: String, required: true },

//     // FIXED COLUMN — user cannot edit
//     transactionType: { type: String, required: true },

//     // NEW COLUMN — user editable category
//     category: { type: String, default: "Uncategorized" },

//     amount: { type: Number, required: true },
//     sortCode: { type: String, default: "" },
//     accountNumber: { type: String, default: "" },
//     balance: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Transaction", transactionSchema);
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionDate: { type: Date, required: true },
    transactionDescription: { type: String, required: true },

    // FIXED COLUMN — user cannot edit
    transactionType: { type: String, required: true },

    // NEW COLUMN — user editable category
    category: { type: String, default: "Uncategorized" },

    amount: { type: Number, required: true },
    sortCode: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
