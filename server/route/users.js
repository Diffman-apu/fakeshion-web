import express from "express";
import { signIn, signUp, getUser, getUsers, followUser } from "../controller/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.get("/all", getUsers);
router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.get("/:id", getUser);
router.patch("/:id/follow", auth, followUser);
export default router;