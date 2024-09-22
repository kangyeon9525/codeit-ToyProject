// 게시글 요청 유효성 검사 미들웨어
export const validatePostRequest = (req, res, next) => {
  const { nickname, title, content, postPassword, groupPassword } = req.body;

  if (!nickname || !title || !content || !postPassword || !groupPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드를 입력하세요' });
  }

  next();
}

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