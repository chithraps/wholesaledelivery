import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { STATUS_CODES } from "@/Constants/codeStatus";

export async function PUT(req, { params }) {
  await connect();
  console.log("in put request");
  const { status } = await req.json();
  const { id } = await params;
  console.log(id, " ", status);
  try {
    if (!id || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: STATUS_CODES.NOT_FOUND }
      );
    }
    console.log("updated order ",updatedOrder)

    return NextResponse.json(
      { message: "Order status updated successfully", order: updatedOrder },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(req, { params }) {
  await connect();
  try {
    console.log("In delete function");

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: STATUS_CODES.NOT_FOUND });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
