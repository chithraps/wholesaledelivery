import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =mongoose.models.Product || mongoose.model("Product", productSchema);
