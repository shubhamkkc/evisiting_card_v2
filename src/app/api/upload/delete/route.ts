import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    // Only attempt to delete if it's a Cloudinary URL
    if (!imageUrl.includes("cloudinary.com")) {
       // If it's not a Cloudinary image, we still "succeed" in removing it from our database perspective (already done on client)
       // or we just return an error if we were specifically asked to delete from Cloudinary.
       // Here, we just return success because the client-side state is already updated.
       return NextResponse.json({ success: true, message: "Not a Cloudinary URL, skipping deletion" });
    }

    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/cloudname/image/upload/v12345678/folder/image.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
    const match = imageUrl.match(regex);
    
    if (!match) {
      return NextResponse.json({ error: "Could not extract public ID from URL" }, { status: 400 });
    }

    const publicId = match[1];

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok" || result.result === "not_found") {
       return NextResponse.json({ success: true, result });
    } else {
       return NextResponse.json({ error: "Failed to delete from Cloudinary", result }, { status: 500 });
    }

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
