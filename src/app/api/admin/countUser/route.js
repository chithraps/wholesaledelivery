import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  const count = await TruckDriver.countDocuments();
  console.log(count)
  return NextResponse.json({ count }, { status: 200 });
  
}
