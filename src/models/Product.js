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

const Product =mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product
