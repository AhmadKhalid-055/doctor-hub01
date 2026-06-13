// Cloudinary SDK Configuration Stub
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResponse {
  url: string;
  publicId: string;
}

/**
 * Uploads a file (base64 or local filepath) to Cloudinary bucket.
 */
export async function uploadToCloudinary(fileString: string, folder: string): Promise<UploadResponse> {
  try {
    // Stub implementation returning mock upload results
    console.log(`[Cloudinary Stub] Uploading file to folder: ${folder}`);
    return {
      url: `https://res.cloudinary.com/demo/image/upload/v1234567890/mock-file.pdf`,
      publicId: `${folder}/mock-file-id`,
    };
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    throw new Error("Cloudinary upload failed");
  }
}

/**
 * Deletes a file resource from Cloudinary storage bucket.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    console.log(`[Cloudinary Stub] Deleting file: ${publicId}`);
    return true;
  } catch (error) {
    console.error("Cloudinary deletion failed", error);
    return false;
  }
}
