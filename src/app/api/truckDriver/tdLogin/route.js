import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 

await connect(); 

export async function POST(req) {
  try {
    const { mobile, password } = await req.json();
   console.log(mobile)
    
    const truckDriver = await TruckDriver.findOne({ mobile });

    if (!truckDriver) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    
    const isMatch = await bcrypt.compare(password, truckDriver.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

   
    const token = jwt.sign(
      { id: truckDriver._id, mobile: truckDriver.mobile, role: "truckDriver" },
      process.env.JWTPRIVATEKEY, 
      { expiresIn: "2h" }
    );
    
    
    const { password: _, ...driverData } = truckDriver._doc;

     // **Store token in HttpOnly Cookie**
     const response = NextResponse.json(
        { message: "Login successful", truckDriver },
        { status: 200 }
    );
    response.cookies.set("tdAuth", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict", 
        path: "/", 
        maxAge: 2 * 60 * 60, 
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}