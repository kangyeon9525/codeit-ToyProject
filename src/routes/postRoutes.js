import express from 'express';
import { createPost, getPosts } from '../controllers/postController.js';
import { validatePostRequest } from '../middlewares/postsValidation.js';

const router = express.Router();

// 게시글 등록 및 목록 조회 라우트
router.route('/groups/:groupId/posts')
  .post(validatePostRequest, createPost) // 게시글 등록 라우트
  .get(getPosts); // 게시글 목록 조회 라우트


export default router;