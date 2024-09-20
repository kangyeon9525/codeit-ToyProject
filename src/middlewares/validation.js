export const validateGroupRequest = (req, res, next) => {
  const { name, password } = req.body;

  // 필수값 검증
  if (!name || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드가 누락되었습니다.' });
  }

  next(); // 유효성 검사가 성공하면 다음 미들웨어로 진행
};