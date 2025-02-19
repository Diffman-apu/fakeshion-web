import express from "express";
import { getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost, getUserPosts } from "../controller/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getPosts);
router.get("/:id/all", getUserPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

export default router;