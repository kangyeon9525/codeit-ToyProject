import Group from '../models/group.js';
import bcrypt from 'bcryptjs';

// 그룹 등록 함수
export const registerGroup = async (req, res, next) => {
  try {
    const {
      name,
      password,
      imageUrl,
      isPublic,
      introduction
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화

    const group = new Group({ // 그룹 생성
      name,
      password: hashedPassword, // 해시된 비밀번호 저장
      imageUrl,
      isPublic,
      introduction
    });

    const savedGroup = await group.save(); // 저장

    return res.status(201).json({
      id: savedGroup._id,
      name: savedGroup.name,
      imageUrl: savedGroup.imageUrl,
      isPublic: savedGroup.isPublic,
      likeCount: savedGroup.likeCount,
      badges: savedGroup.badges,
      postCount: savedGroup.postCount,
      createdAt: savedGroup.createdAt,
      introduction: savedGroup.introduction
    });
  } catch (error) {
    next(error); // 에러는 다음 미들웨어로 전달
  }
}

// 그룹 목록 조회 함수
export const getGroups = async (req, res, next) => {
  try {
    const { 
      page = 1,
      pageSize = 10,
      sortBy = 'latest',
      keyword = '',
      isPublic
    } = req.query;

    // 필터 조건 설정
    const filter = {} 
    if (keyword) {
      filter.name = { $regex: new RegExp(keyword, 'i') }; // 그룹명 검색 (대소문자 구분 X)
    }
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true'; // 공개 여부 필터
    }

    const sortOptions = { // 정렬 기준 설정
      latest: { createdAt: -1 },
      mostPosted: { postCount: -1 },
      mostLiked: { likeCount: -1 },
      mostBadge: { badges: -1 }
    };

    // 데이터 조회
    const totalItemCount = await Group.countDocuments(filter);
    const groups = await Group.find(filter)
      .sort(sortOptions[sortBy])
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    // 응답 데이터 생성
    const responseData = groups.map(group => ({
      id: group._id,
      name: group.name,
      imageUrl: group.imageUrl,
      isPublic: group.isPublic,
      likeCount: group.likeCount,
      badgeCount: group.badges.length, // 획득 배지 수
      postCount: group.postCount,
      createdAt: group.createdAt,
      introduction: group.introduction
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
    next(error); // 에러 발생 시 미들웨어로 전달
  }
};