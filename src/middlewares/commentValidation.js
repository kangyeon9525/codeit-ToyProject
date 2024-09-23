// 댓글 유효성 검사 미들웨어
export const validateCommentRequest = (req, res, next) => {
  const { 
    nickname, 
    content, 
    password 
  } = req.body;

  // 필수 입력 필드 확인
  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드가 누락되었습니다.' });
  }

  // 입력 데이터의 길이나 형식에 대한 추가 검증 필요한 경우 추가
  
  next();
};
