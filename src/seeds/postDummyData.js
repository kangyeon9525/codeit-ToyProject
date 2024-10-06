import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Post from "../models/post.js";
import dotenv from "dotenv";

dotenv.config();

// 그룹 ID를 참조해 더미 데이터 생성
export const seedPosts = async () => {
  const dummyPosts = [];
  const startDate = new Date("2024-09-27T20:00:00.000Z"); // 그룹 생성일보다 하루 뒤로 설정
  const groupPostCount = [9, 5, 3]; // 그룹별 포스트 개수
  let postId = 1; // _id 값을 순차적으로 증가

  for (let groupId = 1; groupId <= groupPostCount.length; groupId++) {
    for (let i = 0; i < groupPostCount[groupId - 1]; i++) {
      const isPublic = postId % 2 !== 0; // 홀수는 공개, 짝수는 비공개
      const likeCount = Math.floor(Math.random() * 9999) + 1; // 1부터 9999 사이 랜덤 좋아요 수
      const createdAt = new Date(startDate.getTime() + postId * 86400000); // 하루씩 추가된 생성일

      const post = {
        _id: postId,
        groupId: groupId, // 그룹 1, 2, 3에 각각 포스트를 할당
        nickname: `user${postId}`,
        title: `${postId}번째 게시물`,
        content: `${postId}번째 게시물의 내용입니다.`,
        postPassword: await bcrypt.hash("1234", 10), // postPassword를 1234로 통일하고 해시화
        imageUrl: "https://codeit-zogakzip-bucket.s3.ap-northeast-2.amazonaws.com/exp5-1727874138263-888538301.png",
        tags: [`tag${postId}`, `tag${postId + 1}`],
        location: "Daegu",
        moment: new Date("2024-09-28T20:00:00.000Z"),
        isPublic: isPublic,
        likeCount: likeCount,
        commentCount: 0, // commentCount를 전부 0으로 설정
        createdAt: createdAt,
        updatedAt: createdAt,
      };

      dummyPosts.push(post);
      postId++; // 다음 포스트로 넘어감
    }
  }

  try {
    // MongoDB 연결
    await mongoose.connect(process.env.DATABASE_URL);

    // 비밀번호 해시화 (postPassword)
    for (let post of dummyPosts) {
      const hashedPassword = await bcrypt.hash(post.postPassword, 10);
      post.postPassword = hashedPassword;
    }

    // 데이터 삽입
    await Post.insertMany(dummyPosts);
    console.log('Dummy post data inserted successfully');

    // Counters 컬렉션에 마지막 _id 값을 삽입 (seq 값은 마지막 _id 값)
    const db = mongoose.connection.db;
    await db.collection('counters').updateOne(
      { id: 'postIdCounter' }, 
      { $set: { seq: postId - 1 } }, // 마지막 _id가 마지막 postId값
      { upsert: true } // 없으면 삽입
    );
    console.log('Counters collection updated successfully');
  } catch (err) {
    console.error(err);
  }
};
