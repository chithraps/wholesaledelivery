import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import bcrypt from "bcryptjs";

export async function POST(request) {
  console.log("in signup post method ");
  await connect();
  try {
    const body = await request.json(); 
    const { name, mobile, address, licenseNumber, password } = body;
    console.log(name," ",mobile," ",address," ",licenseNumber," ",password)

    const existingDriver = await TruckDriver.findOne({
      $or: [{ mobile }, { licenseNumber }],
    });

    if (existingDriver) {
      return Response.json(
        { message: "Mobile already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTruckDriver = new TruckDriver({
      name,
      mobile,
      address,
      licenseNumber,
      password: hashedPassword,
    });

    await newTruckDriver.save();

    return Response.json({ message: "Signup successful!" }, { status: 201 });
  } catch (error) {
    console.error("Error signing up:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
