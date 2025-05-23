import {connect} from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 8;
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { licenseNumber: { $regex: search, $options: "i" } },
    ],
  };

  try {
    const total = await TruckDriver.countDocuments(query);
    const truckDrivers = await TruckDriver.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);
      console.log(total,' ',truckDrivers)

    return NextResponse.json({ data: truckDrivers, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch truck drivers" }, { status: 500 });
  }
}

