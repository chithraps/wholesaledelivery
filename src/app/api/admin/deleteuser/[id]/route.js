import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function DELETE(request, { params }) {
  const { id } = await params;
  console.log("ID IS ", id);
  try {
    if (!id) {
      return NextResponse.json(
        { message: "User Id required!!" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }
    await connect();
    const mongoResult = await TruckDriver.deleteOne({ _id: id });
    if (mongoResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "No user found with the given ID" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to update User" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
