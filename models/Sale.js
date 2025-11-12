const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    productType: {
      type: String,
      enum: ["Gold", "Whisky"],
      required: true,
    },
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    broker: {
      type: String,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
