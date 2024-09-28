import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import '../src/jobs/cronJob.js'; // 크론 잡 실행
import cors from 'cors';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import groupRoutes from '../src/routes/groupRoutes.js';
import postRoutes from '../src/routes/postRoutes.js';
import commentRoutes from '../src/routes/commentRoutes.js';
import imageRoutes from '../src/routes/imageRoutes.js';
dotenv.config();

const app = express();

/* 추후 특정 주소에 대해서만 CORS허용 할 때
const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'http://zogakzip.com'],
};
*/

app.use(cors()); // CORS 허용해 프론트엔드 코드에서 API 사용 가능
app.use(express.json()); // JSON 요청 처리하기 위한 미들웨어 추가

// 정적 파일 제공 (업로드된 이미지 접근 가능)
app.use('/uploads', express.static('uploads'));

// 라우터 사용
app.use('/api', groupRoutes); // 그룹 라우터
app.use('/api', postRoutes); // 게시글 라우터
app.use('/api', commentRoutes); // 댓글 라우터
app.use('/api', imageRoutes); // 이미지 라우터

// 에러 핸들러 미들웨어
app.use(errorHandler)


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log('DB 연결 실패', err));
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));