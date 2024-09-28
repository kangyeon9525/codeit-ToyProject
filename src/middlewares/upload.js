import multer from 'multer';
import path from 'path';

// Multer 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + path.extname(file.originalname)); // 실제 파일명 기반으로 설정
  }
});

export const upload = multer({ storage }).fields([
  { name: 'image', maxCount: 1 }, // image 필드 처리
  { name: 'imageUrl', maxCount: 1 } // imageUrl 필드 처리
]);
