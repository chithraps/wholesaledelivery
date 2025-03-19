import {connect} from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connect();
    console.log("in get method ")
    try {
        const orders = await Order.find()
        .populate("truckDriver", "name mobileNumber") 
        .populate("vendor", "name location contact") 
        .populate("products.product", "name price category"); 
        console.log("orders ",orders)
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch truck drivers" }, { status: 500 });
    }
}