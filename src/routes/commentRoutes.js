import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validateCommentRequest, validateDeleteCommentRequest, validateGetCommentsRequest, validateUpdateCommentRequest } from '../middlewares/commentValidation.js';
import { createComment, deleteComment, getComments, updateComment } from '../controllers/commentController.js';

const router = express.Router();

// 댓글 등록 및 목록 조회 라우트
router.route('/posts/:postId/comments')
  .post(validateCommentRequest, createComment) // 댓글 등록 라우트
  .get(validateGetCommentsRequest, getComments); // 댓글 목록 조회 라우트

// 댓글 수정, 삭제 라우트
router.route('/comments/:commentId')
  .put(validateUpdateCommentRequest, updateComment) // 댓글 수정 라우트
  .delete(validateDeleteCommentRequest, deleteComment); // 댓글 삭제 라우트

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;