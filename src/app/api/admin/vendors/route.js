import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connect();
    const { name, location, contact, email } = await request.json();
    console.log("name is ",name)
    if (!name || !location || !contact || !email) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 404 }
      );
    }
    const newVendor = new Vendor({ name, location, contact, email });
    await newVendor.save();
    return NextResponse.json({
      message: "Vendor created successfully",
      vendor: newVendor,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("In get method vendor ");
    await connect();
    const vendors = await Vendor.find();
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connect();
    const { id } = params;
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
