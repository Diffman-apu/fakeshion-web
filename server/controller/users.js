import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Users from "../model/Users.js";

export const signIn = async (req, res) => {
    const { input, password } = req.body;
    try {
        const existingUsers = await Users.find({ $or: [{ phoneNumber: input }, { email: input }] });
        if (existingUsers.length === 0) {
            return res.status(404).json({ message: "您输入的手机号或邮箱不存在~~" });
        }
        const existingUser = existingUsers[0]
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "密码输入错误！！" });
        }

        const token = jwt.sign({ phoneNumber: existingUser.phoneNumber, id: existingUser._id }, 'test', { expiresIn: "12h" });
        return res.status(200).json({ result: existingUser, token });
    } catch (error) {
        return res.status(500).json({ message: `登录出现未知错误...., ${error.message}` });
    }
}

export const signUp = async (req, res) => {
    const { email, phoneNumber, password, confirmPwd } = req.body;
    try {
        const existingUser = await Users.find({ $or: [{ phoneNumber: phoneNumber }, { email: email }] });
        console.log("服务端注册返回值：", existingUser)
        if (existingUser.length > 0 ) {
            return res.status(400).json({ message: "该手机号或邮箱已被注册~~" });
        }
        if (password !== confirmPwd) {
            return res.status(400).json({ message: "两次密码输入不一致！！！" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await Users.create({ phoneNumber, email, password: hashedPassword });
        const response = {phoneNumber, email, _id: result._id, username: result.username, avatar: result.avatar, description: result.description, followings:[]}
        const token = jwt.sign({ phoneNumber: result.phoneNumber, id: result._id }, 'test', { expiresIn: "12h" });
        return res.status(200).json({ result: response, token });
    } catch (error) {
        return res.status(500).json({ message: `注册出现未知错误...., ${error.message}` });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findById(id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {

    try {
        const users = await Users.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const followUser = async (req, res) => {
    if (!req.userId) {
        return res.status(400).json({ message: "当前登陆状态错误，请检查！" });
    }
    
    const { id: followingId } = req.params;
    try {
        const user = await Users.findById(req.userId);
        if (!user.followings.includes(followingId)) {
            user.followings.push(followingId)
            user.followingCount = user.followingCount + 1
        }
        else {
            user.followings = user.followings.filter(id => id !== followingId)
            user.followingCount = user.followingCount - 1
        }
        const newUser = await Users.findByIdAndUpdate(req.userId, user, { new: true })
        return res.status(200).json(newUser);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
