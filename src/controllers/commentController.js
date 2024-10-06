import Comment from "../models/comment.js";
import Post from "../models/post.js";
import bcrypt from 'bcryptjs';

// 댓글 등록 함수
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

    // 게시글의 commentCount 증가
    post.commentCount += 1;
    await post.save();
    
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

// 댓글 목록 조회 함수
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const {
      page = 1,
      pageSize = 10
    } = req.query;

    // 게시글에 대한 댓글 총 개수
    const totalItemCount = await Comment.countDocuments({ postId });

    // 페이지 계산
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const skipItems = (page - 1) * pageSize;

    // 댓글 목록 조회 (페이지네이션 적용)
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 }) // 최신 순으로 정렬
      .skip(skipItems)
      .limit(parseInt(pageSize, 10)); // 페이지당 아이템 수 제한

    // 응답 데이터 형식
    const responseData = comments.map(comment => ({
      id: comment._id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    // 성공 응답
    return res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages,
      totalItemCount,
      data: responseData,
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 댓글 수정 함수
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const {
      nickname,
      content,
      password
    } = req.body;

    // 댓글 찾기
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, comment.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 댓글 수정
    comment.nickname = nickname || comment.nickname; // 닉네임 변경
    comment.content = content || comment.content; // 내용 변경

    // 수정된 댓글 저장
    const updatedComment = await comment.save();

    // 성공 응답
    return res.status(200).json({
      id: updatedComment._id,
      nickname: updatedComment.nickname,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 댓글 삭제 함수
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { password } = req.body; 

    // 댓글 찾기
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 댓글 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, comment.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 댓글 삭제
    await Comment.findByIdAndDelete(commentId);

    // 게시글의 commentCount 감소
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });

    // 성공 응답
    return res.status(200).json({ message: '답글 삭제 성공' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};