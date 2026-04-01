import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();
const MAX_SIZE_BYTES = 500 * 1024;

async function getCloudinaryPublicId(url: string) {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    let pathParts = parts.slice(uploadIndex + 1);
    if (pathParts[0] && pathParts[0].startsWith("v")) pathParts = pathParts.slice(1);
    const fullPathAndFile = pathParts.join("/");
    const publicIdWithExt = fullPathAndFile.split("?")[0];
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
  } catch (error) {
    return null;
  }
}

async function processImage(url: string | null, logs: string[]): Promise<string | null> {
  if (!url || !url.includes("cloudinary.com")) return url;

  logs.push(`Analyzing: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      logs.push(`[SKIP] Fetch failed: ${res.status}`);
      return url;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sizeKB = Math.round(buffer.length / 1024);

    if (buffer.length <= MAX_SIZE_BYTES) {
      logs.push(`[OK] Size ${sizeKB}KB (under limit).`);
      return url;
    }

    logs.push(`[COMPRESSING] Size ${sizeKB}KB. Compressing...`);
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const newSizeKB = Math.round(compressedBuffer.length / 1024);
    logs.push(`[UPLOAD] Size reduced to ${newSizeKB}KB. Uploading...`);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "evisiting_card" },
        async (error, result) => {
          if (error || !result) {
            logs.push(`[ERROR] Upload failed.`);
            resolve(url);
          } else {
            logs.push(`[SUCCESS] New URL: ${result.secure_url}`);
            const oldPublicId = await getCloudinaryPublicId(url);
            if (oldPublicId) {
              try {
                await cloudinary.uploader.destroy(oldPublicId);
                logs.push(`[DELETED] Old file: ${oldPublicId}`);
              } catch (e) {
                logs.push(`[WARNING] Delete failed: ${oldPublicId}`);
              }
            }
            resolve(result.secure_url);
          }
        }
      );
      const stream = require('stream');
      const readableStream = new stream.PassThrough();
      readableStream.end(compressedBuffer);
      readableStream.pipe(uploadStream);
    });

  } catch (err) {
    logs.push(`[ERROR] Exception: ${err}`);
    return url;
  }
}

export async function GET() {
  const logs: string[] = [];
  logs.push("Starting cleanup...");

  try {
    const businesses = await prisma.business.findMany();
    logs.push(`Found ${businesses.length} businesses.`);

    for (const business of businesses) {
      logs.push(`--- Business: ${business.slug} ---`);
      let needsUpdate = false;
      let newLogo = business.logo;
      let newCover = business.coverPhoto;
      let newGalleryRaw = business.gallery;
      let newServicesRaw = business.services;

      if (business.logo) {
        const updated = await processImage(business.logo, logs);
        if (updated !== business.logo) { newLogo = updated; needsUpdate = true; }
      }
      if (business.coverPhoto) {
        const updated = await processImage(business.coverPhoto, logs);
        if (updated !== business.coverPhoto) { newCover = updated; needsUpdate = true; }
      }

      if (business.gallery && typeof business.gallery === 'string') {
        try {
          const gallery = JSON.parse(business.gallery);
          if (Array.isArray(gallery)) {
            const newGalleryArray = [];
            for (let i = 0; i < gallery.length; i++) {
              const updatedUrl = await processImage(gallery[i], logs);
              newGalleryArray.push(updatedUrl);
              if (updatedUrl !== gallery[i]) needsUpdate = true;
            }
            newGalleryRaw = JSON.stringify(newGalleryArray);
          }
        } catch (e) {}
      }

      if (business.services && typeof business.services === 'string') {
        try {
          const services = JSON.parse(business.services);
          if (Array.isArray(services)) {
            let servicesChanged = false;
            for (let i = 0; i < services.length; i++) {
              if (services[i].image) {
                const updatedUrl = await processImage(services[i].image, logs);
                if (updatedUrl !== services[i].image) {
                  services[i].image = updatedUrl;
                  servicesChanged = true;
                  needsUpdate = true;
                }
              }
            }
            if (servicesChanged) newServicesRaw = JSON.stringify(services);
          }
        } catch (e) {}
      }

      if (needsUpdate) {
        await prisma.business.update({
          where: { id: business.id },
          data: { logo: newLogo, coverPhoto: newCover, gallery: newGalleryRaw, services: newServicesRaw }
        });
        logs.push(`[DB] Updated business: ${business.slug}`);
      }
    }

    logs.push("Cleanup Complete!");
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    logs.push(`[FATAL] ${error}`);
    return NextResponse.json({ success: false, logs }, { status: 500 });
  }
}
