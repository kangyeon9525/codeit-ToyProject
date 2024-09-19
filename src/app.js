import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import groupRoutes from '../src/routes/groupRoutes.js';

const app = express();

// JSON 요청 처리하기 위한 미들웨어 추가
app.use(express.json());

// 그룹 라우터 사용
app.use('/api', groupRoutes);

// 에러 핸들러 미들웨어
app.use(errorHandler)


mongoose.connect(DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log('DB 연결 실패', err));
app.listen(3000, () => console.log('Server Started'));