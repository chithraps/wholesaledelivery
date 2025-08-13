import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/DbConfig";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function POST(req) {
  try {
    await connect();

    const { email, password } = await req.json();
    console.log(" Admin email", email);

    const admin = await Admin.findOne({ email });
    console.log("admin object ",admin)
    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: STATUS_CODES.NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: STATUS_CODES.UNAUTHORIZED }
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
      { status: STATUS_CODES.OK }
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
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
