import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'; // mongoose-sequence를 가져오는 방식 변경
const AutoIncrement = mongooseSequence(mongoose); // mongoose 인스턴스를 전달

const groupSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // id필드 숫자형으로 지정
    name: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    isPublic: { type: Boolean, default: true },
    introduction: { type: String },
    likeCount: { type: Number, default: 0 },
    badges: { type: Array, default: [] },
    postCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

groupSchema.plugin(AutoIncrement, { inc_field: '_id' });

const Group = mongoose.model('Group', groupSchema);

export default Group;