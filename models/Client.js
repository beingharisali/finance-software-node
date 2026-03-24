const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientNumber: { type: Number, unique: true }, 
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    extraInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-increment clientNumber
clientSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastClient = await mongoose
      .model("Client")
      .findOne()
      .sort({ clientNumber: -1 });
    this.clientNumber = lastClient ? lastClient.clientNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);