import express from 'express';
import { registerGroup, getGroups, updateGroup, deleteGroup, getGroupDetail, verifyGroupPassword, likeGroup, checkGroupIsPublic } from '../controllers/groupController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { upload } from '../middlewares/upload.js';
import { validateGroupRequest, validateUpdateGroupRequest, 
  validateDeleteGroupRequest, validateGroupDetailRequest} from '../middlewares/groupValidation.js';

const router = express.Router();

// 그룹 등록 및 목록 조회 라우트
router.route('/groups')
  .post(upload,validateGroupRequest, registerGroup) // 그룹 등록 라우트
  .get(getGroups); // 그룹 목록 조회

// 그룹 수정, 삭제, 상세 정보 조회 라우트
router.route('/groups/:groupId')
  .get(validateGroupDetailRequest, getGroupDetail)  // 그룹 상세 조회
  .put(upload, validateUpdateGroupRequest, updateGroup)  // 그룹 수정
  .delete(validateDeleteGroupRequest, deleteGroup);  // 그룹 삭제

// 그룹 조회 권한 확인 라우트
router.post('/groups/:groupId/verify-password', verifyGroupPassword);

// 그룹 공감하기 라우트
router.post('/groups/:groupId/like', likeGroup);

// 그룹 공개 여부 확인 라우트
router.get('/groups/:groupId/is-public', checkGroupIsPublic);

// 에러 핸들러 미들웨어
router.use(errorHandler);

export default router;