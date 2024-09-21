// 그룹 등록 요청 유효성 검사 미들웨어
export const validateGroupRequest = (req, res, next) => {
  const { name, password } = req.body;

  // 필수값 검증
  if (!name || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드가 누락되었습니다.' });
  }

  next(); // 유효성 검사가 성공하면 다음 미들웨어로 진행
};

// 그룹 수정 요청 유효성 검사 미들웨어
export const validateUpdateGroupRequest = (req, res, next) => {
  const { name, password, imageUrl, isPublic, introduction } = req.body;

  // 허용된 필드만 존재하는지 확인
  const allowedFields = ['name', 'password', 'imageUrl', 'isPublic', 'introduction'];
  const requestFields = Object.keys(req.body);

  const invalidFields = requestFields.filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    return res.status(400).json({ message: '잘못된 요청입니다: 허용되지 않은 필드가 포함되어 있습니다.' });
  }

  // 필수 필드 확인: name, password, imageUrl, isPublic, introduction
  if (!name || !password || !imageUrl || isPublic === undefined || !introduction) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드가 누락되었습니다.' });
  }

  // 유효성 검사 통과
  next();
};

// 삭제 요청 유효성 검사 미들웨어
export const validateDeleteGroupRequest = (req, res, next) => {
  const { password } = req.body;

  // 허용된 필드만 존재하는지 확인
  const allowedFields = ['password'];
  const requestFields = Object.keys(req.body);

  const invalidFields = requestFields.filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    return res.status(400).json({ message: `잘못된 요청입니다: 허용되지 않은 필드가 포함되어 있습니다 (${invalidFields.join(', ')})` });
  }

  // 비밀번호 필수 확인
  if (!password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 비밀번호는 필수입니다' });
  }

  next();
};

// 그룹 상세 조회 요청 유효성 검사 미들웨어
export const validateGroupDetailRequest = (req, res, next) => {
  const { groupId } = req.params;

  // groupId를 숫자로 변환 시도
  const parsedId = Number(groupId);

  // 숫자로 변환되지 않거나 음수일 경우 유효하지 않음
  if (isNaN(parsedId) || parsedId < 0) {
    return res.status(400).json({ message: '잘못된 요청입니다: groupId는 유효한 양의 숫자여야 합니다.' });
  }

  next();
};

// 그룹 비밀번호 확인 요청 유효성 검사 미들웨어
export const validateVerifyPasswordRequest = (req, res, next) => {
  const { password } = req.body;

  // 비밀번호 필수 확인
  if (!password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 비밀번호는 필수입니다' });
  }

  next();
};