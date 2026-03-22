import { Request, Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary';

const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: imageUrl,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: err.message || "Something went wrong",
    });
  }
};

export const UploadController = {
  uploadImage,
};
