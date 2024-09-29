import Post from "../models/post.js";
import Group from "../models/group.js";

export const checkBadgeConditions = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error('그룹을 찾을 수 없습니다.');
    }

    const today = new Date();

    // 7일 연속 추억 등록
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    
    const postsInLast7Days = await Post.find({
      groupId: group._id,
      createdAt: { $gte: last7Days }
    });

    if (postsInLast7Days.length >= 7 && !group.badges.includes('7일 연속 추억 등록')) {
      group.badges.push('7일 연속 추억 등록');
    }

    // 추억 수 20개 이상 등록
    const postCount = await Post.countDocuments({ groupId });
    if (postCount >= 20 && !group.badges.includes('추억 수 20개 이상 등록')) {
      group.badges.push('추억 수 20개 이상 등록');
    }

    // 그룹 생성 후 1년 달성
    const oneYearLater = new Date(group.createdAt);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (today >= oneYearLater && !group.badges.includes('그룹 생성 후 1년 달성')) {
      group.badges.push('그룹 생성 후 1년 달성');
    }

    // 그룹 공감 1만 개 이상 받기
    if (group.likeCount >= 10000 && !group.badges.includes('그룹 공감 1만 개 이상 받기')) {
      group.badges.push('그룹 공감 1만 개 이상 받기');
    }

    // 게시글(추억) 공감 1만 개 이상 받기
    const postWithLikes = await Post.findOne({
      groupId,
      likeCount: { $gte: 10000 }
    });

    if (postWithLikes && !group.badges.includes('추억 공감 1만 개 이상 받기')) {
      group.badges.push('추억 공감 1만 개 이상 받기');
    }
  
    // 그룹 정보 업데이트
    await group.save();
  } catch (error) {
    console.error(`배지 조건 확인 중 오류 발생 (그룹 ID: $${groupId}):`, error);
  }
};
