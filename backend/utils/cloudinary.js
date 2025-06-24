import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlink(filePath, (err) => {
      if (err) console.warn("Could not delete local file:", err);
    });

    return uploadResponse;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Delete image error:", error);
    throw error;
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("Delete video error:", error);
    throw error;
  }
};
