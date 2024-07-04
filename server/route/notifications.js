import express from "express";
import { getNotifications, sendNotification, updateNotification } from "../controller/notifications.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/all", auth,  getNotifications);
router.post("/", auth,  sendNotification);
router.post("/:id", auth,  updateNotification);


export default router