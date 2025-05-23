import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

connect();

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    console.log(id);
    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const imageFile = formData.get("image");
    const stock = formData.get("stock");

    console.log(stock);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = Date.now() + imageFile.name.replaceAll(" ", "_");
    const s3Key = `products/${filename}`;
    const bucketName = "warehousemanage";
    const uploadParams = {
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
      ContentType: imageFile.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const existingProduct = await Product.findById(id);
    const oldImageKey = existingProduct.imageUrl?.split("/products/")[1];
    if (oldImageKey) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `products/${oldImageKey}`,
        })
      );
    }

    const updateData = {
      name,
      price,
      category,
      image: s3Key,
      stock,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating product", error },
      { status: 500 }
    );
  }
}
