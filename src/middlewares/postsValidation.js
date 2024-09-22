// 게시글 요청 유효성 검사 미들웨어
export const validatePostRequest = (req, res, next) => {
  const { nickname, title, content, postPassword, groupPassword } = req.body;

  if (!nickname || !title || !content || !postPassword || !groupPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드를 입력하세요' });
  }

  next();
};

// 게시글 목록 조회 요청 유효성 검사 미들웨어
export const validateGetPostsRequest = (req, res, next) => {
  const { 
    page, 
    pageSize, 
    sortBy, 
    isPublic 
  } = req.query;
  const validSortOptions = ['latest', 'mostCommented', 'mostLiked'];

  // page 및 pageSize가 숫자인지 확인
  if (page && isNaN(parseInt(page))) {
    return res.status(400).json({ message: '잘못된 요청입니다: 잘못된 페이지 번호입니다' });
  }
  if (pageSize && isNaN(parseInt(pageSize))) {
    return res.status(400).json({ message: '잘못된 요청입니다: 잘못된 페이지 크기입니다' });
  }

  // sortBy가 유효한 값인지 확인
  if (sortBy && !validSortOptions.includes(sortBy)) {
    return res.status(400).json({ message: '잘못된 요청입니다: 잘못된 정렬 기준입니다' });
  }

  // isPublic이 boolean 값인지 확인
  if (isPublic !== undefined && isPublic !== 'true' && isPublic !== 'false') {
    return res.status(400).json({ message: '잘못된 요청입니다: isPublic은 true 또는 false여야 합니다' });
  }

  next(); // 모든 검증 통과 시, 다음 미들웨어로 넘어감
};

// 게시글 수정 요청 유효성 검사 미들웨어
export const validateUpdatePostRequest = (req, res, next) => {
  const {
    nickname,
    title,
    content,
    postPassword,
    imageUrl,
    tags,
    location,
    moment,
    isPublic
  } = req.body;

  // 필수 필드 검증
  if (!postPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다: 게시글 비밀번호는 필수입니다.' });
  }

  // 각 필드의 유효성 검증
  if (nickname && typeof nickname !== 'string') {
    return res.status(400).json({ message: '잘못된 요청입니다: 닉네임은 문자열이어야 합니다.' });
  }
  if (title && typeof title !== 'string') {
    return res.status(400).json({ message: '잘못된 요청입니다: 제목은 문자열이어야 합니다.' });
  }
  if (content && typeof content !== 'string') {
    return res.status(400).json({ message: '잘못된 요청입니다: 내용은 문자열이어야 합니다.' });
  }
  if (imageUrl && typeof imageUrl !== 'string') {
    return res.status(400).json({ message: '잘못된 요청입니다: 이미지 URL은 문자열이어야 합니다.' });
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: '잘못된 요청입니다: 태그는 문자열 배열이어야 합니다.' });
  }
  if (location && typeof location !== 'string') {
    return res.status(400).json({ message: '잘못된 요청입니다: 위치는 문자열이어야 합니다.' });
  }
  if (moment && isNaN(Date.parse(moment))) {
    return res.status(400).json({ message: '잘못된 요청입니다: 유효한 날짜를 입력하세요.' });
  }
  if (isPublic !== undefined && typeof isPublic !== 'boolean') {
    return res.status(400).json({ message: '잘못된 요청입니다: 공개 여부는 true 또는 false여야 합니다.' });
  }

  // 모든 검증을 통과하면 다음 미들웨어로 이동
  next();
};

// 게시글 삭제 요청 유효성 검사 미들웨어
export const validateDeletePostRequest = (req, res, next) => {
  const { postPassword } = req.body;

  // 허용된 필드만 존재하는지 확인
  const allowedFields = ['postPassword'];
  const requestFields = Object.keys(req.body);

  const invalidFields = requestFields.filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    return res.status(400).json({ message: `잘못된 요청입니다: 허용되지 않은 필드가 포함되어 있습니다 (${invalidFields.join(', ')})` });
  }

  // 비밀번호 필수 확인
  if (!postPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다: 비밀번호는 필수입니다' });
  }

  next();
};