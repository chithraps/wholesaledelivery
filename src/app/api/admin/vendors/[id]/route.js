import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connect();
    const { id } = params;
    console.log("in put ")
    const updateData = await request.json();
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedVendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Vendor updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connect();
    const { id } = params;
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
