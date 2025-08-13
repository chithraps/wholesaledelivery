import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const { name, mobile, address, licenseNumber } = await request.json();
    console.log("id ", id, " ", name);
    if (!name || !mobile || !address || !licenseNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }
    await connect();

    const mongoResult = await TruckDriver.updateOne(
      { _id: id },
      { $set: { name, mobile, address, licenseNumber } }
    );    
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update User" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
