import {connect} from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function GET(req) {
  await connect();

  try {
    const [truckDrivers, vendors, products] = await Promise.all([
      TruckDriver.find({}),
      Vendor.find({}),
      Product.find({}),
    ]);
    console.log("truckDrivers ",truckDrivers)
    
    return NextResponse.json({ truckDrivers, vendors, products }, { status: STATUS_CODES.OK });
  } catch (error) {
    console.error("Error fetching order data:", error);
   
    return NextResponse.json({ error: "Failed to fetch order data"}, { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
}
