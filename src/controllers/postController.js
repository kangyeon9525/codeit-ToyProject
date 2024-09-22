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

// 게시글 목록 조회 함수
export const getPosts = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'latest',
      keyword = '',
      isPublic
    } = req.query;

    // 그룹 존재 여부 확인
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 필터 조건 설정
    const filter = { groupId }; // 기본적으로 해당 그룹의 게시글을 찾음
    if (keyword) {
      filter.$or = [
        { title: { $regex: new RegExp(keyword, 'i') } },
        { tags: { $regex: new RegExp(keyword, 'i') } },
      ]; // 제목 또는 태그에 대해 검색
    }
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    // 정렬 기준 설정
    const sortOptions = {
      latest: { createdAt: -1 },
      mostCommented: { commentCount: -1 },
      mostLiked: { likeCount: -1 }
    };

    // 게시글 목록 조회
    const totalItemCount = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort(sortOptions[sortBy])
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    // 응답 데이터 생성
    const responseData = posts.map(post => ({
      id: post._id,
      nickname: post.nickname,
      title: post.title,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    }));

    // 페이징 처리
    const totalPages = Math.ceil(totalItemCount / pageSize);

    res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages,
      totalItemCount,
      data: responseData
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};