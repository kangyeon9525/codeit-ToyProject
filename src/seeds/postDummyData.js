import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Post from "../models/post.js";
import dotenv from "dotenv";

dotenv.config();

// 그룹 ID를 참조해 더미 데이터 생성
export const seedPosts = async () => {
  const dummyPosts = [
    {
      _id: 1,
      groupId: 1, // groupId가 1인 그룹에 게시물 연결
      nickname: "user1",
      title: "첫 번째 게시물",
      content: "첫 번째 게시물의 내용입니다.",
      postPassword: "1234",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Seoul",
      moment: "2024-09-26T20:00:00.000Z",
      isPublic: true,
      likeCount: 10,
      commentCount: 2,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 2,
      groupId: 1,
      nickname: "user2",
      title: "두 번째 게시물",
      content: "두 번째 게시물의 내용입니다.",
      postPassword: "password123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Busan",
      moment: "2024-09-27T20:00:00.000Z",
      isPublic: false,
      likeCount: 15,
      commentCount: 2,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 3,
      groupId: 1, 
      nickname: "user3",
      title: "세 번째 게시물",
      content: "세 번째 게시물의 내용입니다.",
      postPassword: "1234",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag5", "tag6"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 20,
      commentCount: 3,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 4,
      groupId: 2,
      nickname: "user4",
      title: "네 번째 게시물",
      content: "네 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 20,
      commentCount: 2,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 5,
      groupId: 2,
      nickname: "user5",
      title: "다섯 번째 게시물",
      content: "다섯 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: false,
      likeCount: 20,
      commentCount: 3,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 6,
      groupId: 3,
      nickname: "user6",
      title: "여섯 번째 게시물",
      content: "여섯 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 30,
      commentCount: 1,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 7,
      groupId: 4,
      nickname: "user7",
      title: "일곱 번째 게시물",
      content: "일곱 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 20,
      commentCount: 1,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 8,
      groupId: 4,
      nickname: "user8",
      title: "여덟 번째 게시물",
      content: "여덟 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: false,
      likeCount: 10,
      commentCount: 0,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 9,
      groupId: 4,
      nickname: "user9",
      title: "아홉 번째 게시물",
      content: "아홉 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 9999,
      commentCount: 0,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 10,
      groupId: 4,
      nickname: "user10",
      title: "열 번째 게시물",
      content: "열 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: true,
      likeCount: 9999,
      commentCount: 0,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    },
    {
      _id: 11,
      groupId: 4,
      nickname: "user11",
      title: "11 번째 게시물",
      content: "11 번째 게시물의 내용입니다.",
      postPassword: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2455601727/display_1500/stock-photo-cute-character-d-image-of-candy-floss-with-stick-2455601727.jpg",
      tags: ["tag1", "tag2"],
      location: "Daegu",
      moment: "2024-09-28T20:00:00.000Z",
      isPublic: false,
      likeCount: 9999,
      commentCount: 0,
      createdAt: new Date("2024-10-02T23:00:00.000Z"),
      updatedAt: new Date("2024-10-02T23:00:00.000Z")
    }
  ];

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
      { $set: { seq: 11 } }, // 마지막 _id가 11이므로 seq를 11로 설정
      { upsert: true } // 없으면 삽입
    );
    console.log('Counters collection updated successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};
