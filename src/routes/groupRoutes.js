import express from 'express';
import { registerGroup, getGroups } from '../controllers/groupController.js';
import { validateGroupRequest } from '../middlewares/validation.js';

const router = express.Router();

// 그룹 등록 라우트, 요청 검증 미들웨어 추가
router.post('/groups', validateGroupRequest, registerGroup);

// 그룹 목록 조회 라우트
router.get('/groups', getGroups);

export default router;