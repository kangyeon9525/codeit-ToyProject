import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Comment from "../models/comment.js";
import dotenv from "dotenv";

dotenv.config();

// 게시글 ID를 참조해 더미 데이터 생성
export const seedComments = async () => {
  const dummyComments = [];
  const postCommentCount = { 1: 9, 2: 2, 3: 3, 4: 1 }; // 각 게시글에 할당될 댓글 개수
  let commentId = 1;

  for (let postId in postCommentCount) {
    for (let i = 0; i < postCommentCount[postId]; i++) {
      const comment = {
        _id: commentId,
        postId: parseInt(postId), // postId는 문자열이므로 정수로 변환
        nickname: `commenter${commentId}`,
        content: `댓글${commentId}`,
        password: "12345", // 비밀번호를 12345로 통일하고 해시화
      };

      dummyComments.push(comment);
      commentId++; // 다음 댓글로 넘어감
    }
  }

  try {
    // MongoDB 연결
    await mongoose.connect(process.env.DATABASE_URL);

    // 비밀번호 해시화 (password)
    for (let comment of dummyComments) {
      const hashedPassword = await bcrypt.hash(comment.password, 10);
      comment.password = hashedPassword;
    }

    // 데이터 삽입
    await Comment.insertMany(dummyComments);
    console.log('Dummy comment data inserted successfully');

    // Counters 컬렉션에 마지막 _id 값을 삽입 (seq 값은 마지막 _id 값)
    const db = mongoose.connection.db;
    await db.collection('counters').updateOne(
      { id: 'commentIdCounter' }, 
      { $set: { seq: commentId - 1 } }, // 마지막 _id가 마지막 commentId 값
      { upsert: true } // 없으면 삽입
    );
  } catch (err) {
    console.error(err);
  }
};
