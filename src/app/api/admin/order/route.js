import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import TruckDriver from "@/models/TruckDriver";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function GET(req) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;
    console.log(limit, " ", skip);
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate("truckDriver", "name mobileNumber")
      .populate("vendor", "name location contact")
      .populate("products.product", "name price category");
    console.log("orders *****", orders);
    return NextResponse.json(
      {
        orders,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
export async function POST(req) {
  await connect();
  try {
    const body = await req.json();
    const { truckDriver, vendor, product, totalAmount, status } = body;

    if (
      !truckDriver ||
      !vendor ||
      !product ||
      !product.product ||
      product.quantity <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Truck driver, vendor, and a valid product with quantity are required.",
        },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    if (totalAmount < 0) {
      return NextResponse.json(
        { error: "Total amount cannot be negative." },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const newOrder = new Order({
      truckDriver,
      vendor,
      products: [
        {
          product: product.product,
          quantity: product.quantity,
        },
      ],
      totalAmount,
      status: status || "pending",
    });

    await newOrder.save();
    const updatedProduct = await Product.findByIdAndUpdate(
      product.product,
      { $inc: { stock: -product.quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or update failed" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    if (updatedProduct.stock < 0) {
      return NextResponse.json(
        { error: "Insufficient stock available" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
