import Post from '../models/post.js';
import Group from '../models/group.js';
import bcrypt from 'bcryptjs';

// 게시글(추억) 등록 함수
export const createPost = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const {
      nickname,
      title,
      content,
      postPassword,
      groupPassword,
      imageUrl,
      tags,
      location,
      moment,
      isPublic
    } = req.body;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '그룹을 찾을 수 없습니다.'});
    }

    // 그룹 비밀번호 검증
    const isGroupPasswordValid = await bcrypt.compare(groupPassword, group.password);
    if (!isGroupPasswordValid) {
      return res.status(403).json({ message: '그룹 비밀번호가 잘못되었습니다.' });
    }

    // 게시글 비밀번호 해시화
    const hashedPostPassword = await bcrypt.hash(postPassword, 10);

    // 새 게시글 생성
    const post = new Post({
      groupId,
      nickname,
      title,
      content,
      postPassword: hashedPostPassword,
      imageUrl,
      tags,
      location,
      moment,
      isPublic,
    });

    const savedPost = await post.save();

    return res.status(201).json({
      id: savedPost._id,
      groupId: savedPost.groupId,
      nickname: savedPost.nickname,
      title: savedPost.title,
      content: savedPost.content,
      imageUrl: savedPost.imageUrl,
      tags: savedPost.tags,
      location: savedPost.location,
      moment: savedPost.moment,
      isPublic: savedPost.isPublic,
      likeCount: savedPost.likeCount,
      commentCount: savedPost.commentCount,
      createdAt: savedPost.createdAt,
    });
  } catch(error) {
    next(error); // 에러는 다음 미들웨어로 전달
  }
};