import express from 'express';
import { registerGroup, getGroups, updateGroup } from '../controllers/groupController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validateGroupRequest } from '../middlewares/validation.js';
import { validateUpdateGroupRequest } from '../middlewares/updateValidation.js';

const router = express.Router();

// 그룹 등록 라우트, 요청 검증 미들웨어 추가
router.post('/groups', validateGroupRequest, registerGroup);

// 그룹 목록 조회 라우트
router.get('/groups', getGroups);

// 그룹 수정 라우트
router.put('/groups/:groupId', validateUpdateGroupRequest, updateGroup);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;