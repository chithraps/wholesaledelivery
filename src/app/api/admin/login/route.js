import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/DbConfig";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connect();

    const { email, password } = await req.json();
    console.log(" Admin email", email);

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email ,role: "admin"},
      process.env.JWTPRIVATEKEY,
      { expiresIn: "2h" }
    );

    const adminData = admin.toObject();
    delete adminData.password;

    const response = NextResponse.json(
      { message: "Login successful", admin: adminData },
      { status: 200 }
    );

    response.headers.append(
      "Set-Cookie",
      `adminAuth=${token}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${
        2 * 60 * 60
      }`
    );

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
