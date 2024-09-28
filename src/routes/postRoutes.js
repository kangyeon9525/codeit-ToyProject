import express from 'express';
import { checkPostIsPublic, createPost, deletePost, getPostDetail, getPosts, likePost, updatePost, verifyPostPassword } from '../controllers/postController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { upload } from '../middlewares/upload.js';
import { validatePostRequest, validateGetPostsRequest, validateUpdatePostRequest, validateDeletePostRequest, validateGetPostDetailRequest } from '../middlewares/postsValidation.js';

const router = express.Router();

// 게시글 등록 및 목록 조회 라우트
router.route('/groups/:groupId/posts')
  .post(upload,validatePostRequest, createPost) // 게시글 등록 라우트
  .get(validateGetPostsRequest, getPosts); // 게시글 목록 조회 라우트

// 게시글 수정, 삭제, 상세 정보 조회  라우트
router.route('/posts/:postId')
  .put(upload, validateUpdatePostRequest, updatePost) // 게시글 수정 라우트
  .delete(validateDeletePostRequest, deletePost) // 게시글 삭제 라우트
  .get(validateGetPostDetailRequest, getPostDetail); // 게시글 상세 정보 조회 라우트

// 게시글 조회 권한 확인 라우트
router.post('/posts/:postId/verify-password', verifyPostPassword);

// 게시글 공감하기 라우트
router.post('/posts/:postId/like', likePost);

// 게시글 공개 여부 확인 라우트
router.get('/posts/:postId/is-public', checkPostIsPublic);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;