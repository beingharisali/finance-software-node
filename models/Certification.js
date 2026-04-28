
const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    certification: {
      type: String,
      default: null,
      index: true,
    },

    denomination: { type: String, default: "" },
    year: { type: Number, default: "" },
    reverse: { type: String, default: "" },
    grade: { type: String, default: "" },
    price: { type: Number, default: 0 },
    scPrice: { type: Number, default: 0 },


    status: {
      type: String,
      default: "Available",
    },

    allocatedBroker: {
      type: String,
      default: "",
    },

    statusDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);