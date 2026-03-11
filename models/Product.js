
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);