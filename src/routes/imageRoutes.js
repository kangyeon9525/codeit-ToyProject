import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { uploadImage } from '../controllers/imageController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// 이미지 URL 생성 라우트
router.post('/image', upload, uploadImage);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;