// 게시글 요청 유효성 검사 미들웨어
export const validatePostRequest = (req, res, next) => {
  const { nickname, title, content, postPassword, groupPassword } = req.body;

  if (!nickname || !title || !content || !postPassword || !groupPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다: 필수 필드를 입력하세요' });
  }

  next();
}