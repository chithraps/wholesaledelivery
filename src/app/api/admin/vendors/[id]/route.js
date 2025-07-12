import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
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
export async function GET(req, { params }) {
  await connect();
  const vendorId = params.id;
  console.log("in get method ",vendorId)
  try {
    const vendor = await Vendor.findById(vendorId).populate("products");
    if (!vendor) {
      return new Response(JSON.stringify({ error: "Vendor not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ products: vendor.products }), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch vendor products", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
