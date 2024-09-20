import express from 'express';
import { registerGroup, getGroups, updateGroup, deleteGroup, getGroupDetail, verifyGroupPassword, likeGroup } from '../controllers/groupController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validateGroupRequest, validateUpdateGroupRequest, validateDeleteGroupRequest, 
  validateGroupDetailRequest, validateVerifyPasswordRequest} from '../middlewares/validation.js';

const router = express.Router();

// 그룹 등록 라우트
router.post('/groups', validateGroupRequest, registerGroup);

// 그룹 목록 조회 라우트
router.get('/groups', getGroups);

// 그룹 수정 라우트
router.put('/groups/:groupId', validateUpdateGroupRequest, updateGroup);

// 그룹 삭제 라우트
router.delete('/groups/:groupId', validateDeleteGroupRequest, deleteGroup);

// 그룹 상세 정보 조회 라우트
router.get('/groups/:groupId', validateGroupDetailRequest, getGroupDetail);

// 그룹 조회 권한 확인 라우트
router.post('/groups/:groupId/verify-password', validateVerifyPasswordRequest, verifyGroupPassword);

// 그룹 공감하기 라우트
router.post('/groups/:groupId/like', likeGroup);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;