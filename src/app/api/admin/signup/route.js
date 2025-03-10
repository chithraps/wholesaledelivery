import { connect } from "@/dbConfig/DbConfig";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

await connect();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("In admin route ",email);
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return Response.json(
        { message: "Admin already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    return Response.json({ message: "Signup successfull!" }, { status: 201 });
  } catch (error) {
    console.error("signUp Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
