import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    creatorId: String,
    content: String,
    messageTime: {
        type: Date,
        default: new Date()
    },
    type: {  // 指消息的物理类型，如属于图片，或文本，或视频
        type: String,
        default: 'text' // text, image, video, json
    },
    tag: {  // 指消息的逻辑类型，如属于真实对话，或机器通知
        type: String,
        default: 'msg'  // msg, info
    }
})

const chatSchema = new mongoose.Schema({
    lastMessage: String,
    lastMessageTime: Date,
    users: {
        type: [String],
        default: [],
    },
    messages: {
        type: [messageSchema],
        default: [],
    },
    unreadUserId: {
        type: String,
        default: ''
    },
    unreadMsgCnt: {
        type: Number,
        default: 0
    },
});

const Chats = mongoose.model('Chats', chatSchema);
export default Chats;