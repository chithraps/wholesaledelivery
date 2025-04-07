import { connect } from "@/dbConfig/DbConfig";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connect();
  console.log("in put request");
  const { status } = await req.json();
  const { id } = params;
  console.log(id, " ", status);
  try {
    if (!id || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json(
      { message: "Order status updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
