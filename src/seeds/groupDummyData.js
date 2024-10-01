import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Group from "../models/group.js";
import dotenv from "dotenv";

dotenv.config();

export const seedGroups = async () => {
  const dummyGroups = [
    {
      _id: 1,
      name: "group1",
      password: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2458991037/display_1500/stock-photo-abstract-dark-gritty-industrial-landscape-black-and-white-theme-techno-elements-silhouette-of-2458991037.jpg",
      isPublic: true,
      introduction: "설명1",
      likeCount: 100,
      badges: [],
      postCount: 3,
      createdAt: new Date("2024-09-26T20:00:00.000Z"),
      updatedAt: new Date("2024-10-01T20:00:00.000Z"),
    },
    {
      _id: 2,
      name: "group2",
      password: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2458991037/display_1500/stock-photo-abstract-dark-gritty-industrial-landscape-black-and-white-theme-techno-elements-silhouette-of-2458991037.jpg",
      isPublic: false,
      introduction: "설명2",
      likeCount: 50,
      badges: [],
      postCount: 2,
      createdAt: new Date("2024-09-27T20:00:00.000Z"),
      updatedAt: new Date("2024-10-01T20:00:00.000Z"),
    },
    {
      _id: 3,
      name: "group3",
      password: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2459631665/display_1500/stock-photo-young-asian-enjoy-drinking-boba-milk-tea-2459631665.jpg",
      isPublic: true,
      introduction: "설명3",
      likeCount: 20,
      badges: [],
      postCount: 1,
      createdAt: new Date("2024-09-28T20:00:00.000Z"),
      updatedAt: new Date("2024-09-28T20:00:00.000Z"),
    },
    {
      _id: 4,
      name: "group4",
      password: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2459631665/display_1500/stock-photo-young-asian-enjoy-drinking-boba-milk-tea-2459631665.jpg",
      isPublic: false,
      introduction: "설명4",
      likeCount: 9999,
      badges: [],
      postCount: 5,
      createdAt: new Date("2024-09-29T20:00:00.000Z"),
      updatedAt: new Date("2024-09-29T20:00:00.000Z"),
    },
    {
      _id: 5,
      name: "group5",
      password: "123",
      imageUrl: "https://www.shutterstock.com/shutterstock/photos/2458991037/display_1500/stock-photo-abstract-dark-gritty-industrial-landscape-black-and-white-theme-techno-elements-silhouette-of-2458991037.jpg",
      isPublic: true,
      introduction: "설명5",
      likeCount: 10001,
      badges: [],
      postCount: 0,
      createdAt: new Date("2024-09-30T20:00:00.000Z"),
      updatedAt: new Date("2024-09-30T20:00:00.000Z"),
    },
  ];

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
      { $set: { seq: 5 } }, // 마지막 _id가 5이므로 seq를 5로 설정
      { upsert: true } // 없으면 삽입
    );
    console.log('Counters collection updated successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};
