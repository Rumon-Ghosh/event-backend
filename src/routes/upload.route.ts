import express from 'express';
import { upload } from '../middlewares/upload.middleware';
import { UploadController } from '../controller/upload.controller';

const router = express.Router();

// Route for uploading a single image
router.post('/', upload.single('image'), UploadController.uploadImage);

export const UploadRoute = router;
