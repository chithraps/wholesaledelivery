import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ]
  },
  { timestamps: true }
);

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
export default Vendor;
