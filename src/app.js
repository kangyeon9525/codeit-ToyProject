import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import groupRoutes from '../src/routes/groupRoutes.js';
import postRoutes from '../src/routes/postRoutes.js';

dotenv.config();

const app = express();

// JSON 요청 처리하기 위한 미들웨어 추가
app.use(express.json());

// 라우터 사용
app.use('/api', groupRoutes); // 그룹 라우터
app.use('/api', postRoutes); // 게시글 라우터

// 에러 핸들러 미들웨어
app.use(errorHandler)


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log('DB 연결 실패', err));
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));