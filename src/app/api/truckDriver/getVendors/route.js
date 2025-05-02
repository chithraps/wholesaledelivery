import { connect } from "@/dbConfig/DbConfig";
import Vendor from '@/models/Vendor';
import { NextResponse } from "next/server";

await connect(); 

export async function GET(){
    const vendors = await Vendor.find({});
    return NextResponse.json(vendors);
}