import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);
