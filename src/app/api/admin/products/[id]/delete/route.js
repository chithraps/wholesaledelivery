import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    try {
        await connect(); 
        const { id } = params; 

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
    }
}
