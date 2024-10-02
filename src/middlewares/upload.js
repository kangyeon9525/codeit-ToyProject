import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // 최상단에 위치

// AWS S3 설정
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Multer S3 설정
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 Content-Type 설정
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
}).fields([
  { name: 'image', maxCount: 1 }, // image 필드 처리
  { name: 'imageUrl', maxCount: 1 }, // imageUrl 필드 처리
]);

