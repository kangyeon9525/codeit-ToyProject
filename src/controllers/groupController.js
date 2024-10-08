import Group from '../models/group.js';
import { checkBadgeConditions } from '../services/badgeService.js';
import bcrypt from 'bcryptjs';

// 그룹 등록 함수
export const registerGroup = async (req, res, next) => {
  try {
    const {
      name,
      password,
      imageUrl, // 클라이언트에서 이미지 URL 전달
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
};

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

// 그룹 수정 함수
export const updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params; // 그룹 ID 추출
    const {
      name,
      password,
      imageUrl, // 클라이언트에서 이미지 URL 전달
      isPublic,
      introduction
    } = req.body;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' }); // 그룹이 존재 X
    }


    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, group.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' }); // 비밀번호 불일치
    }

    // 이미지 URL 업데이트 (이미지가 빈 문자열인 경우 이미지 삭제)
    if (imageUrl !== undefined) {
      group.imageUrl = imageUrl || ''; // 클라이언트가 보내준 이미지 URL로 갱신
    }

    // 그룹 정보 업데이트
    group.name = name || group.name;
    group.isPublic = typeof isPublic === 'boolean' ? isPublic : group.isPublic;
    group.introduction = introduction || group.introduction;

    // 그룹 저장
    const updatedGroup = await group.save();

    // 성공 응답
    return res.status(200).json({
      id: updatedGroup._id,
      name: updatedGroup.name,
      imageUrl: updatedGroup.imageUrl,
      isPublic: updatedGroup.isPublic,
      likeCount: updatedGroup.likeCount,
      badges: updatedGroup.badges,
      postCount: updatedGroup.postCount,
      createdAt: updatedGroup.createdAt,
      introduction: updatedGroup.introduction
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 그룹 삭제 함수
export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params; // 그룹 ID 추출
    const { password } = req.body; // 요청에서 비밀번호 추출

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, group.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' }); // 비밀번호 불일치
    }

    // 그룹 삭제
    await Group.deleteOne({ _id: groupId });

    // 삭제 성공 응답
    return res.status(200).json({ message: '그룹 삭제 성공' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 그룹 상세 정보 조회 함수
export const getGroupDetail = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 그룹 상세 정보 반환
    const groupDetail = {
      id: group._id,
      name: group.name,
      imageUrl: group.imageUrl,
      isPublic: group.isPublic,
      likeCount: group.likeCount,
      badges: group.badges,
      postCount: group.postCount,
      createdAt: group.createdAt,
      introduction: group.introduction,
    };

    res.status(200).json(groupDetail);
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 그룹 조회 권한 확인 함수
export const verifyGroupPassword = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { password } = req.body;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비공개 그룹 여부 확인
    if (group.isPublic) {
      return res.status(400).json({ message: '이 그룹은 비공개 그룹이 아닙니다.' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, group.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 비밀번호 확인 성공 응답
    res.status(200).json({ message: '비밀번호가 확인되었습니다' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 그룹 공감하기 함수
export const likeGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 그룹 공감수 증가
    group.likeCount += 1;

    // 변경사항 저장
    await group.save();

    // 배지 조건 확인 및 갱신
    checkBadgeConditions(groupId);

    // 성공 응답
    res.status(200).json({ message: '그룹 공감하기 성공' });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// 그룹 공개 여부 확인 함수
export const checkGroupIsPublic = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // 그룹 찾기
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 공개 여부 반환
    res.status(200).json({
      id: group._id,
      isPublic: group.isPublic
    });
  } catch (error) {
    next(error); // 에러 처리 미들웨어로 전달
  }
};