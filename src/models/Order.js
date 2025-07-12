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
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "order placed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    currentLocation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
