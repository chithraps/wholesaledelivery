import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  const count = await Vendor.countDocuments();
  return NextResponse.json({ count }, { status: 200 });
  
}