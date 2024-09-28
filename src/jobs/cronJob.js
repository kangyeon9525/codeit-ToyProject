import cron from 'node-cron';
import { checkBadgeConditions } from '../services/badgeService.js';

// 매일 자정에 배지 조건 확인
cron.schedule('0 0 * * *', async () => {
  try {
    const groups = await Group.find();
    for (const group of groups) {
      await checkBadgeConditions(group._id); // 배지 조건 확인 및 갱신
    }
    console.log('배지 조건 확인 및 갱신 완료');
  } catch (error) {
    console.error('배지 조건 확인 중 오류 발생:', error);
  }
});
