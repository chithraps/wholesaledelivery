import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function GET(req) {
  await connect();
  const count = await Vendor.countDocuments();
  return NextResponse.json({ count }, { status: STATUS_CODES.OK });
  
}