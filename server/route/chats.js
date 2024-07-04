import express from "express";
import { getChat, getChats, sendMsg } from "../controller/chats.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", auth,  getChats);
router.get("/:id", auth,  getChat);
router.post("/:id", auth,  sendMsg);

export default router