import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { STATUS_CODES } from "@/Constants/codeStatus";

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

export async function GET(req) {
  // try {
  //   console.log("in product route")
  //   await connect();
  //   const products = await Product.find();
  //   const bucketName = "herbsonline";
  //   const productsWithSignedUrls = await Promise.all(
  //     products.map(async (product) => {
  //       if (product.image) {
  //         const signedUrl = await generatePresignedUrl(bucketName, product.image);
  //         return { ...product.toObject(), imageUrl: signedUrl };
  //       }
  //       return product.toObject();
  //     })
  //   );

  //   return NextResponse.json(productsWithSignedUrls, { status: 200 });
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  // }
  try {
    await connect();

   
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    
    const totalProducts = await Product.countDocuments();

    
    const products = await Product.find().skip(skip).limit(limit);
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

    
    const response = {
      products: productsWithSignedUrls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    };

    return NextResponse.json(response, { status: STATUS_CODES.OK });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
  }

}
