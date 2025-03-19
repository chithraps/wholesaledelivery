import { connect } from "@/dbConfig/DbConfig";
import TruckDriver from "@/models/TruckDriver";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const { id } = await params;
    
      try {
         if(!id){
            return NextResponse.json(
                { message: "User Id required!!" },
                { status: 400 }
              );
         }
        await connect();            
        const mongoResult = await TruckDriver.deleteOne({ _id: id });
        if (mongoResult.deletedCount === 0) {
         
            return NextResponse.json(
                { message: "User deleted successfully" },
                { status: 200 }
              );
        }
    
          } catch (error) {
            console.error("Error deleting user:", error);
            return NextResponse.json(
              { error: "Failed to update User" },
              { status: 500 }
            );
          }
    }