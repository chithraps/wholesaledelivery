import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, price, category, stock } = await request.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, category, stock },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
    }
}
