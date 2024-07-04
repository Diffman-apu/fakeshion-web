import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default: `用户${new Date().getTime()}`
    },
    description: {
        type: String,
        default: '无'
    },
    avatar: {
        type: String,
        default: 'https://xxxx.oss-cn-beijing.aliyuncs.com/avatars/default.png'
    },
    followerCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    followings: {
        type: [String],
        default: []
    }
});


const Users = mongoose.model('Users', userSchema);
export default Users;