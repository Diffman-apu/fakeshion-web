import mongoose from "mongoose";
import { type } from "os";

const commentSchema = new mongoose.Schema({
    creatorId: String,
    text: String,
    createTime: {
        type: Date,
        default: new Date()
    }
})

const postSchema = new mongoose.Schema({
    creatorId: String,
    caption: {
        type: String,
        default: '无'
    },
    imageURL: {
        type: String,
        default: 'https://inst-clone.oss-cn-beijing.aliyuncs.com/postImages/default.jpg'
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
    createTime: {
        type: Date,
        default: new Date()
    },
});

const Posts = mongoose.model('Posts', postSchema);
export default Posts;