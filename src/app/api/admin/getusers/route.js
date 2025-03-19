import {connect} from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connect();
    console.log("in get method ")
    try {
        const truckDrivers = await TruckDriver.find().select("-password"); 
        console.log("truckDrivers ",truckDrivers)
        return NextResponse.json(truckDrivers, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch truck drivers" }, { status: 500 });
    }
}
