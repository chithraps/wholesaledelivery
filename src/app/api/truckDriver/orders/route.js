import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";
import TruckDriver from "@/models/TruckDriver";

export async function POST(request) {
  try {
    await connect();

    const body = await request.json();
    const { vendor, truckDriver, products, totalAmount } = body;

    
    if (!vendor || !truckDriver || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = new Order({
      vendor,
      truckDriver,
      products,
      totalAmount,
    });

    await order.save();

    return NextResponse.json({ message: "Order created successfully", order }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method GET not allowed" }, { status: 405 });
}
