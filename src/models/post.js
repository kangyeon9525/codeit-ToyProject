import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const AutoIncrement = mongooseSequence(mongoose);

const postSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    groupId: { type: Number, requried: true, ref: 'Group' },
    nickname: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    postPassword: { type: String, required: true },
    imageUrl: { type: String },
    tags: { type: [String], default: [] },
    location: { type: String },
    moment: { type: String },
    isPublic: { type: Boolean, default: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// moment 필드가 날짜만 남도록 처리
postSchema.pre('save', function (next) {
  if (this.moment) {
    const date = new Date(this.moment);
    this.moment = date.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식으로 저장
  }
  next();
});

postSchema.plugin(AutoIncrement, { inc_field: '_id', id: 'postIdCounter' });

const Post = mongoose.model('Post', postSchema);

export default Post;