import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function GET(req) {
  await connect();
  const count = await TruckDriver.countDocuments();
  console.log(count)
  return NextResponse.json({ count }, { status: STATUS_CODES.OK });
  
}
