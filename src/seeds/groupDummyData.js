import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Group from "../models/group.js";
import dotenv from "dotenv";

dotenv.config();

export const seedGroups = async () => {
  const dummyGroups = [];
  const startDate = new Date("2024-09-26T20:00:00.000Z");

  for (let i = 1; i <= 18; i++) {
    const isPublic = i % 2 !== 0;
    const likeCount = Math.floor(Math.random() * 9999) + 1;
    const createdAt = new Date(startDate.getTime() + i * 86400000); // 하루씩 추가

    const group = {
      _id: i,
      name: `그룹${i}`,
      password: await bcrypt.hash("123", 10),
      imageUrl: "https://codeit-zogakzip-bucket.s3.ap-northeast-2.amazonaws.com/exp1-1728110891671-606588665.png",
      isPublic: isPublic,
      introduction: `설명${i}`,
      likeCount: likeCount,
      badges: [],
      postCount: 0,
      createdAt: createdAt,
      updatedAt: createdAt,
    };

    dummyGroups.push(group);
  }

  try {
    // MongoDB 연결
    await mongoose.connect(process.env.DATABASE_URL);

    // 비밀번호 해시화
    for (let group of dummyGroups) {
      const hashedPassword = await bcrypt.hash(group.password, 10);
      group.password = hashedPassword;
    }

    // 데이터 삽입
    await Group.insertMany(dummyGroups);
    console.log('Dummy data inserted successfully');

    // Counters 컬렉션에 마지막 _id 값을 삽입 (seq 값은 마지막 _id 값)
    const db = mongoose.connection.db;
    await db.collection('counters').updateOne(
      { id: 'groupIdCounter' }, 
      { $set: { seq: dummyGroups.length } }, // 마지막 _id가 마지막 groupId값
      { upsert: true } // 없으면 삽입
    );
    console.log('Counters collection updated successfully');
  } catch (err) {
    console.error(err);
  }
};
