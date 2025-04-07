import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  console.log("in get method ");
  try {
    const orders = await Order.find()
      .populate("truckDriver", "name mobileNumber")
      .populate("vendor", "name location contact")
      .populate("products.product", "name price category");
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch truck drivers" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  await connect();
  console.log("In post method ");
  try {
    const body = await req.json();
    const {
      truckDriver,
      vendor,
      products,
      totalAmount,
      collectedAmount,
      status,
    } = body;

    if (!truckDriver || !vendor || !products || products.length === 0) {
      return NextResponse.json(
        {
          error: "Truck driver, vendor, and at least one product are required.",
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

    if (collectedAmount > totalAmount) {
      return NextResponse.json(
        { error: "Collected amount cannot be greater than total amount." },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      truckDriver,
      vendor,
      products,
      totalAmount,
      collectedAmount,
      status: status || "pending",
    });

    await newOrder.save();

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
