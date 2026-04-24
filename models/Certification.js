const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    // unique: true ko hata diya hai taake null duplicates ka error na aaye
    // Agar unique rakhna hai toh sparse: true zaroori hai
    certification: { 
      type: String, 
      default: null, 
      index: true 
    },

    // Number fields mein default "" nahi, balki 0 ya null rakhein
    denomination: { type: Number, default: 0 },

    year: { type: Number, default: 0 },

    reverse: { type: String, default: "" },

    grade: { type: String, default: "" },

    price: { type: Number, default: 0 },

    scPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);