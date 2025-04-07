import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    truckDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TruckDriver",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    collectedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "shipped","delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
