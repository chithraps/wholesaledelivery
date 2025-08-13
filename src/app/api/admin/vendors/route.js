import { connect } from "@/dbConfig/DbConfig";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function POST(request) {
  try {
    await connect();
    const { name, location, contact, email,products  } = await request.json();
    console.log("name is ", name);
    if (!name || !location || !contact || !email) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }
    const newVendor = new Vendor({ name, location, contact, email,products });
    await newVendor.save();
    return NextResponse.json({
      message: "Vendor created successfully",
      vendor: newVendor,
    },{ status: STATUS_CODES.CREATED });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
}

export async function GET(request) {
  try {
    console.log("In get method vendor");
    await connect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const total = await Vendor.countDocuments();

    const vendors = await Vendor.find().populate("products").skip(skip).limit(limit);

    return NextResponse.json({
      vendors,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }
}

