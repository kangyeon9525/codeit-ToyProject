import Image from '../models/image.js';

// 이미지 URL 생성 함수
export const uploadImage = async (req, res, next) => {
  try {

    // 이미지 업로드된 경우, 이미지 URL 생성
    let imageUrl = '';
    if (req.files && req.files.image) { // image 필드 확인
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
    } else if (req.body.image === '') { // 이미지 URL을 빈 문자열로 보내면 이미지 삭제
      return res.status(400).json({ error: '이미지 파일이 없습니다.' });
    }

    // 이미지 저장
    const image = new Image({ imageUrl });
    const savedImage = await image.save(); // DB에 저장
    
    // 성공적으로 생성된 이미지 URL 응답
    return res.status(200).json({ imageUrl: savedImage.imageUrl });
  } catch (error) {
    next(error);
  }
};


