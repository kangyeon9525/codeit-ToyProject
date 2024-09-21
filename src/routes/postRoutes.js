import express from 'express';
import { createPost } from '../controllers/postController.js';
import { validate } from 'superstruct';

const router = express.Router();

router.post('/groups/:groupId/posts', createPost);


export default router;