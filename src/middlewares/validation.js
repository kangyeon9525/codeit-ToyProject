export const validateGroupRequest = (req, res, next) => {
  const { name, password } = req.body;

  // 필수값 검증
  if (!name || !password) {
    const error = new Error("잘못된 요청입니다");
    error.status = 400; // 400 에러로 설정
    return next(error);  // 에러 미들웨어로 전달
  }

  next(); // 유효성 검사가 성공하면 다음 미들웨어로 진행
};