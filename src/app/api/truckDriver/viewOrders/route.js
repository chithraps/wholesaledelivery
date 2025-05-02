import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const truckDriverId = searchParams.get("truckDriverId");

    if (!truckDriverId) {
      return NextResponse.json({ error: "Missing truckDriverId" }, { status: 400 });
    }

    const orders = await Order.find({ truckDriver: truckDriverId })
      .populate("vendor", "name")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
