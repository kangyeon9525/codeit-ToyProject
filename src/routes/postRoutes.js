import express from 'express';
import { createPost, deletePost, getPostDetail, getPosts, updatePost, verifyPostPassword } from '../controllers/postController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validatePostRequest, validateGetPostsRequest, validateUpdatePostRequest, validateDeletePostRequest, validateGetPostDetailRequest } from '../middlewares/postsValidation.js';

const router = express.Router();

// 게시글 등록 및 목록 조회 라우트
router.route('/groups/:groupId/posts')
  .post(validatePostRequest, createPost) // 게시글 등록 라우트
  .get(validateGetPostsRequest, getPosts); // 게시글 목록 조회 라우트

// 게시글 수정, 삭제, 상세 정보 조회  라우트
router.route('/posts/:postId')
  .put(validateUpdatePostRequest, updatePost) // 게시글 수정 라우트
  .delete(validateDeletePostRequest, deletePost) // 게시글 삭제 라우트
  .get(validateGetPostDetailRequest, getPostDetail); // 게시글 상세 정보 조회 라우트

// 게시글 조회 권한 확인 라우트
router.post('/posts/:postId/verify-password', verifyPostPassword);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;