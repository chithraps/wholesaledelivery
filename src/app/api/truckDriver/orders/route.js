import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";
import TruckDriver from "@/models/TruckDriver";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function POST(request) {
  try {
    await connect();
    console.log("In post ")
    const body = await request.json();
    const { vendor, truckDriver, products, totalAmount } = body;   

    console.log(vendor," ", truckDriver," ", products, " ",totalAmount )
     
    if (!vendor || !truckDriver || !Array.isArray(products) || products.length === 0 || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: STATUS_CODES.BAD_REQUEST });
    }
    
    const order = new Order({
      vendor,
      truckDriver,
      products, 
      totalAmount,
    });


    await order.save();

    return NextResponse.json({ message: "Order created successfully", order }, { status: STATUS_CODES.CREATED });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method GET not allowed" }, { status: 405 });
}
