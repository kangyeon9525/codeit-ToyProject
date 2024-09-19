import Group from '../models/group.js';
import bcrypt from 'bcryptjs';

export const registerGroup = async (req, res, next) => {
  try {
    const {
      name,
      password,
      imageUrl,
      isPublic,
      introduction
    } = req.body;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 그룹 생성
    const group = new Group({
      name,
      password: hashedPassword, // 해시된 비밀번호 저장
      imageUrl,
      isPublic,
      introduction
    });

    // 저장
    const savedGroup = await group.save();

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