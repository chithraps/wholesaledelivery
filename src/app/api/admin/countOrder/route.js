import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  const count = await Order.countDocuments();
  return NextResponse.json({ count }, { status: 200 });
  
}