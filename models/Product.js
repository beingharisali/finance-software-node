
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, index: true, default: null }, 
    liquidMake: String,
    product: { type: Date, required: false },
    caskNo: String,
    vessel: String,
    lAlc: { type: Number, default: 0 },
    volPercent: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    location: String,
    bottles: { type: Number, default: 0 },
    supplierPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    status: { type: String, default: "Available" },
    allocatedBroker: { type: String, default: "" },
    statusDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);