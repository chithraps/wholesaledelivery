import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "delivery_management",
    });
    console.log("Database connection is ready !!!");
  } catch (error) {
    console.log("error occured ", error);
  }
}
