
const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    saleName: { type: String, required: true },
    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    clientName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    date: { type: Date, required: true },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
