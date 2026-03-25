
const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true, required: true },

    liquidMake: String,
    product: { type: Date, required: true }, 
    caskNo: String,
    vessel: String,
    lAlc: Number,
    volPercent: Number,
    costPrice: Number,
    supplierPrice: Number,
    finalPrice: Number,
    status: { type: String, default: "Available" },
    allocatedBroker: { type: String, default: "" },
    statusDate: { type: Date, default: null }
  },
  { timestamps: true }
);
productSchema.index({ productId: 1, caskNo: 1 }, { unique: true });
module.exports = mongoose.model("Product", productSchema);