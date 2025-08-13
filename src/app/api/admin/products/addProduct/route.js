import { connect } from "@/dbConfig/DbConfig";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { STATUS_CODES } from "@/Constants/codeStatus";

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  async function generatePresignedUrl(bucketName, s3Key) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });
  
    return await getSignedUrl(s3, command, { expiresIn: 3600 }); 
  }

export async function POST(request) {
  try {
    await connect();

    const formData = await request.formData();
    console.log(formData.get("name"));
    const name = formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const imageFile = formData.get("image");
    const stock = formData.get("stock");
    if (!imageFile) {
        return NextResponse.json(
            { error: "No files received." },
            { status: STATUS_CODES.BAD_REQUEST }
          );
    }    
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = Date.now() + imageFile.name.replaceAll(" ", "_");
    console.log(filename);

    const bucketName = "herbsonline";
    const s3Key = `products/${filename}`;
    console.log("s3Key ", s3Key);
    const uploadParams = {
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
      ContentType: imageFile.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const newProduct = new Product({
        name,
        price,
        category,
        image:s3Key,
        stock,        
      });
  
      await newProduct.save();
      return NextResponse.json(
        { message: "Product uploaded successfully" },
        { status: STATUS_CODES.OK }
      );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to add products" },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
