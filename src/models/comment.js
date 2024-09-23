import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const AutoIncrement = mongooseSequence(mongoose);

const commentSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // 자동 증가 ID
    postId: { type: Number, required: true, ref: 'Post' }, // 연관된 게시글 ID
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // 생성 및 수정 시간 자동 기록
  },
);

// AutoIncrement 플러그인 사용
commentSchema.plugin(AutoIncrement, { inc_field: '_id', id: 'commentIdCounter' });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;