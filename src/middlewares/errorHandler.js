export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500; // 에러 상태 코드가 있으면 사용하고 없으면 500 사용
  const message = err.message || '서버 오류가 발생했습니다';

  res.status(status).json({ message });
};