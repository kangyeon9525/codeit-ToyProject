import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Comment from "../models/comment.js";

// 게시글 ID를 참조해 더미 데이터 생성
const dummyComments = [
  {
    _id: 1,
    postId: 1, 
    nickname: "commenter1",
    content: "댓글1",
    password: "12345",
  },
  {
    _id: 2,
    postId: 1, 
    nickname: "commenter2",
    content: "댓글2",
    password: "12345",
  },
  {
    _id: 3,
    postId: 2, 
    nickname: "commenter3",
    content: "댓글3",
    password: "12345",
  },
  {
    _id: 4,
    postId: 2, 
    nickname: "commenter4",
    content: "댓글4",
    password: "12345",
  },
  {
    _id: 5,
    postId: 3, 
    nickname: "commenter5",
    content: "댓글5",
    password: "12345",
  },
  {
    _id: 6,
    postId: 3, 
    nickname: "commenter6",
    content: "댓글6",
    password: "12345",
  },
  {
    _id: 7,
    postId: 3, 
    nickname: "commenter7",
    content: "댓글7",
    password: "12345",
  },
  {
    _id: 8,
    postId: 4, 
    nickname: "commenter8",
    content: "댓글8",
    password: "12345",
  },
  {
    _id: 9,
    postId: 4, 
    nickname: "commenter9",
    content: "댓글9",
    password: "12345",
  },
  {
    _id: 10,
    postId: 5, 
    nickname: "commenter10",
    content: "댓글10",
    password: "12345",
  },
  {
    _id: 11,
    postId: 5, 
    nickname: "commenter11",
    content: "댓글11",
    password: "12345",
  },
  {
    _id: 12,
    postId: 5, 
    nickname: "commenter12",
    content: "댓글12",
    password: "12345",
  },
  {
    _id: 13,
    postId: 6, 
    nickname: "commenter13",
    content: "댓글13",
    password: "12345",
  },
  {
    _id: 14,
    postId: 7, 
    nickname: "commenter14",
    content: "댓글14",
    password: "12345",
  },
  
];

const seedComments = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect("mongodb+srv://kangyeon9525:kky1212@codeit.ukgol.mongodb.net/?retryWrites=true&w=majority&appName=codeit");

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
      { $set: { seq: 11 } }, // 마지막 _id가 11이므로 seq를 11로 설정
      { upsert: true } // 없으면 삽입
    );

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

// 스크립트 실행
seedComments();