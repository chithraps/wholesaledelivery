import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate("truckDriver", "name mobileNumber")
      .populate("vendor", "name location contact")
      .populate("products.product", "name price category");

    return NextResponse.json({ orders, totalOrders, currentPage: page }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    if (totalAmount < 0) {
      return NextResponse.json(
        { error: "Total amount cannot be negative." },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      truckDriver,
      vendor,
      product: {
        product: product.product,
        quantity: product.quantity,
      },
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
        { status: 400 }
      );
    }

    if (updatedProduct.stock < 0) {
      return NextResponse.json(
        { error: "Insufficient stock available" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
