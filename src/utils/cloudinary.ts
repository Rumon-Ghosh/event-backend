import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

if (!config.cloudinary_cloud_name || !config.cloudinary_api_key || !config.cloudinary_api_secret) {
  console.error("CRITICAL: Cloudinary configuration is missing. Check your environment variables.");
}

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!config.cloudinary_cloud_name || !config.cloudinary_api_key || !config.cloudinary_api_secret) {
      return reject(new Error("Cloudinary configuration is incomplete. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."));
    }

    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'eventera' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        if (result) return resolve(result.secure_url);
        reject(new Error("Unknown error during upload"));
      }
    ).end(fileBuffer);
  });
};
