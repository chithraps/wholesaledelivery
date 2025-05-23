import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function DELETE(request, { params }) {
  try {
    await connect(); 

    const { id } = params; 

    // Fetch the product to get the S3 image key before deleting it
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    
    const s3Key = product.image;

   
    const bucketName = "warehousemanage";

    
    const deleteParams = {
      Bucket: bucketName,
      Key: s3Key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`Deleted image from S3: ${s3Key}`);

   
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product and image deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
