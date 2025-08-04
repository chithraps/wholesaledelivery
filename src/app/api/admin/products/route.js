import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

 async function generatePresignedUrl(bucketName, s3Key) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });
  
    return await getSignedUrl(s3, command, { expiresIn: 3600 }); 
  }

export async function GET() {
  try {
    console.log("in product route")
    await connect();
    const products = await Product.find();
    const bucketName = "herbsonline";
    const productsWithSignedUrls = await Promise.all(
      products.map(async (product) => {
        if (product.image) {
          const signedUrl = await generatePresignedUrl(bucketName, product.image);
          return { ...product.toObject(), imageUrl: signedUrl };
        }
        return product.toObject();
      })
    );

    return NextResponse.json(productsWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
