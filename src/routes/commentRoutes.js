import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validateCommentRequest } from '../middlewares/commentValidation.js';
import { createComment } from '../controllers/commentController.js';

const router = express.Router();

// 댓글 등록 라우트
router.route('/posts/:postId/comments')
  .post(validateCommentRequest, createComment); // 댓글 등록 라우트

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;