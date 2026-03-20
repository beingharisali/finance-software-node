const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true },
    date: { type: String, required: true }, // store as string or Date
    broker: { type: String, required: true },
    client: { type: String, required: true },
    products: [{ type: String, required: true }],
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);