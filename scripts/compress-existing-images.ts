import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { resolve } from "path";
import { config } from "dotenv";

// Load environment variables manually if needed
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

// Ensure env variables are loaded
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.error("Missing Cloudinary Env Vars");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();
const MAX_SIZE_BYTES = 500 * 1024; // 500 KB limit for existing images

async function getCloudinaryPublicId(url: string) {
  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/id.ext
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Everything after upload/vXXX/ is the public ID
    let pathParts = parts.slice(uploadIndex + 1);
    
    // Skip version if present
    if (pathParts[0] && pathParts[0].startsWith("v")) {
      pathParts = pathParts.slice(1);
    }
    
    // public ID includes folder structure but NOT file extension
    const fullPathAndFile = pathParts.join("/");
    const publicIdWithExt = fullPathAndFile.split("?")[0]; // remove query params
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    
    return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
  } catch (error) {
    return null;
  }
}

async function processImage(url: string | null): Promise<string | null> {
  if (!url || !url.includes("cloudinary.com")) return url;

  console.log(`\nAnalyzing Image: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[SKIP] Could not fetch image (Status: ${res.status})`);
      return url;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sizeKB = Math.round(buffer.length / 1024);

    if (buffer.length <= MAX_SIZE_BYTES) {
      console.log(`[OK] Size is ${sizeKB}KB (Under 500KB). No action needed.`);
      return url;
    }

    console.log(`[COMPRESSING] Size is ${sizeKB}KB (> 500KB). Processing...`);

    // Compress using Sharp (webp for max compression without losing noticeable quality)
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const newSizeKB = Math.round(compressedBuffer.length / 1024);
    console.log(`[UPLOAD] Sharp reduced size from ${sizeKB}KB to ${newSizeKB}KB. Uploading to Cloudinary...`);

    // Upload new buffer to Cloudinary
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "evisiting_card" },
        async (error, result) => {
          if (error || !result) {
            console.error(`[ERROR] Upload failed for ${url}:`, error);
            resolve(url); // Return original URL if failed
          } else {
            console.log(`[SUCCESS] New URL: ${result.secure_url}`);

            // Delete old file from Cloudinary logic
            const oldPublicId = await getCloudinaryPublicId(url);
            if (oldPublicId) {
              try {
                await cloudinary.uploader.destroy(oldPublicId);
                console.log(`[DELETED] Old huge image removed from Cloudinary: ${oldPublicId}`);
              } catch (delErr) {
                console.log(`[WARNING] Failed to delete old image ${oldPublicId}`, delErr);
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
    console.error(`[ERROR] Failed to process ${url}:`, err);
    return url;
  }
}

async function main() {
  console.log("Starting Cloudinary Existing Images Cleanup script...");
  const businesses = await prisma.business.findMany();
  console.log(`Found ${businesses.length} businesses in database.\n`);

  let totalSpaceSavedBytes = 0;
  let compressedCount = 0;

  for (const business of businesses) {
    console.log(`--- Processing Business: ${business.businessName} [${business.slug}] ---`);
    let needsUpdate = false;
    let newLogo = business.logo;
    let newCover = business.coverPhoto;
    let newGalleryRaw = business.gallery;
    let newServicesRaw = business.services;

    // 1. Process Logo
    if (business.logo) {
      const updated = await processImage(business.logo);
      if (updated !== business.logo) {
        newLogo = updated;
        needsUpdate = true;
      }
    }

    // 2. Process Cover Photo
    if (business.coverPhoto) {
      const updated = await processImage(business.coverPhoto);
      if (updated !== business.coverPhoto) {
        newCover = updated;
        needsUpdate = true;
      }
    }

    // 3. Process Gallery (JSON Array)
    try {
      if (business.gallery && typeof business.gallery === 'string') {
        const gallery = JSON.parse(business.gallery);
        if (Array.isArray(gallery)) {
          const newGalleryArray = [];
          for (let i = 0; i < gallery.length; i++) {
            const updatedUrl = await processImage(gallery[i]);
            newGalleryArray.push(updatedUrl);
            if (updatedUrl !== gallery[i]) needsUpdate = true;
          }
          newGalleryRaw = JSON.stringify(newGalleryArray);
        }
      }
    } catch (err) {
       console.log("Gallery Parse Error:", err);
    }

    // 4. Process Services (JSON Array of Objects { image: string })
    try {
      if (business.services && typeof business.services === 'string') {
        const services = JSON.parse(business.services);
        if (Array.isArray(services)) {
          let servicesChanged = false;
          for (let i = 0; i < services.length; i++) {
            if (services[i].image) {
              const updatedUrl = await processImage(services[i].image);
              if (updatedUrl !== services[i].image) {
                services[i].image = updatedUrl;
                servicesChanged = true;
                needsUpdate = true;
              }
            }
          }
          if (servicesChanged) {
             newServicesRaw = JSON.stringify(services);
          }
        }
      }
    } catch (err) {
       console.log("Services Parse Error:", err);
    }

    if (needsUpdate) {
      console.log(`[DB UPDATE] Saving new optimized URLs for ${business.slug}...`);
      await prisma.business.update({
        where: { id: business.id },
        data: {
          logo: newLogo,
          coverPhoto: newCover,
          gallery: newGalleryRaw,
          services: newServicesRaw
        }
      });
      console.log(`[DB UPDATE] Successfully saved ${business.slug}.`);
    } else {
      console.log(`[SKIP DB] No changes needed for ${business.slug}.`);
    }
  }

  console.log("\nCleanup Complete! All existing businesses have been analyzed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
