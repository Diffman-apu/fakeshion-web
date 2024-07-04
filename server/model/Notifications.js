import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    uid: String,
    relatedUid: String,
    relatedPostId: {
        type: String,
        default: ''
    },
    relatedCommentId: {
        type: String,
        default: ''
    },
    content: String,  
    isRead: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date,
        default: new Date()
    },
    type: String   // 'follow', 'like', 'comment', 
});

const Notifications = mongoose.model('Notifications ', notificationSchema);
export default Notifications;

// ①xxx刚刚关注了你. 
// ②xxx在使用fakeshion，你可能认识哦. 
// ③xxx刚刚分享了22张照片
// ④xxx刚刚评论了你的作品
// ⑤xxx刚刚点赞了你的作品