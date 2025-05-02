import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";

import { NextResponse } from "next/server";

await connect();

export async function GET() {
  console.log("in getProduct");
  const products = await Product.find({});
  return NextResponse.json(products);
}
