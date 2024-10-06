import Post from '../models/post.js';
import Group from '../models/group.js';
import { checkBadgeConditions } from '../services/badgeService.js';
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

    // 그룹의 postCount 증가
    group.postCount += 1;
    await group.save();

    // 배지 조건 확인 및 갱신
    checkBadgeConditions(groupId);

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

// 게시글 수정 함수
export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
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

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }
    
    // 게시글 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(postPassword, post.postPassword);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 이미지 URL 업데이트 (이미지가 빈 문자열인 경우 이미지 삭제)
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl || ''; // 클라이언트가 보내준 이미지 URL로 갱신
    }

    // 게시글 정보 업데이트
    post.nickname = nickname || post.nickname;
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.location = location || post.location;
    post.moment = moment || post.moment;
    post.isPublic = typeof isPublic === 'boolean' ? isPublic : post.isPublic;

    // 게시글 저장
    const updatedPost = await post.save();

    // 성공 응답
    return res.status(200).json({
      id: updatedPost._id,
      groupId: updatedPost.groupId,
      nickname: updatedPost.nickname,
      title: updatedPost.title,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl,
      tags: updatedPost.tags,
      location: updatedPost.location,
      moment: updatedPost.moment,
      isPublic: updatedPost.isPublic,
      likeCount: updatedPost.likeCount,
      commentCount: updatedPost.commentCount,
      createdAt: updatedPost.createdAt,
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 게시글 삭제 함수
export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { postPassword } = req.body;

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 게시글 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(postPassword, post.postPassword);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 게시글 삭제
    await Post.findByIdAndDelete(postId);

    // 그룹의 postCount 감소
    await Group.findByIdAndUpdate(post.groupId, { $inc: { postCount: -1 } });

    // 성공 응답
    return res.status(200).json({ message: '게시글 삭제 성공' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 게시글 상세 조회 함수
export const getPostDetail = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 게시글 상세 정보 반환
    const postDetail = {
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    };

    return res.status(200).json(postDetail);
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 게시글 조회 권한 확인 함수
export const verifyPostPassword = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비공개 그룹 여부 확인
    if (post.isPublic) {
      return res.status(400).json({ message: '이 게시글은 비공개 게시글이 아닙니다.' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, post.postPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 비밀번호 확인 성공
    return res.status(200).json({ message: '비밀번호가 확인되었습니다' });

  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 게시글 공감하기 함수
export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 게시글이 속한 그룹의 groupId 가져오기
    const groupId = post.groupId; // 게시글에서 groupId 추출

    // 게시글 공감수 증가
    post.likeCount += 1;

    // 게시글 저장
    await post.save();

    // 배지 조건 확인 및 갱신
    checkBadgeConditions(groupId);

    // 성공 응답
    return res.status(200).json({ message: '게시글 공감하기 성공' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 게시글 공개 여부 함수
export const checkPostIsPublic = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 게시글 찾기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 공개 여부 반환
    res.status(200).json({
      id: post._id,
      isPublic: post.isPublic
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};