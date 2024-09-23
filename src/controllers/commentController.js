import Comment from "../models/comment.js";
import Post from "../models/post.js";
import bcrypt from 'bcryptjs';

// 댓글 등록 컨트롤러
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const {
      nickname,
      content,
      password
    } = req.body;

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 필수 입력 필드 확인
    if (!nickname || !content || !password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 댓글 생성
    const comment = new Comment({
      postId,
      nickname,
      content,
      password: hashedPassword,
    });

    const savedComment = await comment.save();
    
    // 성공 응답
    return res.status(200).json({
      id: savedComment._id,
      nickname: savedComment.nickname,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};
