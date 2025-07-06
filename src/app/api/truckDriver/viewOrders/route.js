import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";
import TruckDriver from "@/models/TruckDriver";

export async function GET(req) {
  await connect();

  try {
    console.log("in get method")
    const { searchParams } = new URL(req.url);
    const truckDriverId = searchParams.get("truckDriverId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 2;

    if (!truckDriverId) {
      return NextResponse.json({ error: "Missing truckDriverId" }, { status: 400 });
    }

    const totalOrders = await Order.countDocuments({ truckDriver: truckDriverId });

    const orders = await Order.find({ truckDriver: truckDriverId })
      .populate("vendor", "name")
      .populate("product.product", "name price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        orders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}