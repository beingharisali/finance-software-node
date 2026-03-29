const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true },
    // date: { type: String, required: true }, // store as string or Date
    date: { type: Date, required: true, default: Date.now }, // <-- CHANGE here
    broker: { type: String, required: true },
    client: { type: String, required: true },
    // products: [{ type: String, required: true }],
    products: [
  {
    productId: { type: String, required: true },
    price: { type: Number, required: true }
  }
],

    status: { type: String, default: "document sent" },
    commission: { type: Number, default: 0 },
    
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);