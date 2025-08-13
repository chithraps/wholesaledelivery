import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";


export async function GET(req) {
  await connect();
  const count = await Order.countDocuments();
  return NextResponse.json({ count }, { status: STATUS_CODES.OK });
  
}