import Posts from "../model/Posts.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {

    try {
        const posts = await Posts.find({}, { comments: 0 }).sort({ createTime: -1 });
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {

    try {
        const { id: userId } = req.params
        const posts = await Posts.find({ creatorId: String(userId) }, { comments: 0 }).sort({ createTime: -1 });
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Posts.findById(id);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await Posts.find({ title });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }

    try {
        const post = req.body;
        const newPost = await Posts.create({ ...post, createTime: new Date().toISOString() });
        res.status(200).json(newPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
    const updatedPost = await Posts.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    await Posts.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("post id 不存在或非法！");
    }

    const post = await Posts.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        post.likes.push(req.userId);
        post.likesCount = post.likesCount + 1;
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
        post.likesCount = post.likesCount - 1;
    }
    const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
    return res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "当前未登录，请登录！" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("post id 不存在或非法！");
    }

    const { value } = req.body;
    const post = await Posts.findById(id);
    const newComment = { creatorId: req.userId, text: value, createTime: new Date() }
    post.comments.unshift(newComment);
    post.commentsCount = post.commentsCount + 1;
    const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
    return res.status(200).json(updatedPost);
}

