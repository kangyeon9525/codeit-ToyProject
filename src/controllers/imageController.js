import Image from '../models/image.js';

// 이미지 URL 생성 함수
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 없습니다.' });
    }

    // 업로드된 파일의 URL 생성
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // 이미지 저장
    const image = new Image({ imageUrl });
    const savedImage = await image.save(); // DB에 저장
    
    // 성공적으로 생성된 이미지 URL 응답
    return res.status(200).json(
      { 
        imageUrl: savedImage.imageUrl 
      }
    );
  } catch (error) {
    next(error);
  }
};


