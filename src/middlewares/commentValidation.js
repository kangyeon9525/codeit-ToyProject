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

// 댓글 목록 조회 유효성 검사 미들웨어
export const validateGetCommentsRequest = (req, res, next) => {
  const { page, pageSize } = req.query;

  // 페이지 번호와 페이지 크기가 숫자인지 확인
  if (page && (isNaN(page) || parseInt(page, 10) < 1)) {
    return res.status(400).json({ message: '잘못된 요청입니다: 유효한 페이지 번호를 입력하세요.' });
  }

  if (pageSize && (isNaN(pageSize) || parseInt(pageSize, 10) < 1)) {
    return res.status(400).json({ message: '잘못된 요청입니다: 유효한 페이지 크기를 입력하세요.' });
  }

  // 다음 미들웨어로 진행
  next();
};

// 댓글 수정 유효성 검사 미들웨어
export const validateUpdateCommentRequest = (req, res, next) => {
  const { 
    nickname, 
    content, 
    password 
  } = req.body;

  // 필수 입력 필드 확인
  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드가 누락되었습니다.' });
  }

  // 다음 미들웨어로 진행
  next();
};

// 댓글 삭제 유효성 검사 미들웨어
export const validateDeleteCommentRequest = (req, res, next) => {
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