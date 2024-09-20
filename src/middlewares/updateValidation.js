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