import {connect} from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const [truckDrivers, vendors, products] = await Promise.all([
      TruckDriver.find({}),
      Vendor.find({}),
      Product.find({}),
    ]);
    console.log("truckDrivers ",truckDrivers)
    
    return NextResponse.json({ truckDrivers, vendors, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order data:", error);
   
    return NextResponse.json({ error: "Failed to fetch order data"}, { status: 500 });
  }
}
