import express from 'express';
import { uploadImage } from '../controllers/imageController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// 이미지 URL 생성 라우트
router.post('/image', upload, uploadImage);

export default router;