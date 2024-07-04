import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import postsRoutes from "./route/posts.js";
import userRoutes from "./route/users.js";
import chatsRoutes from "./route/chats.js";
import notificationsRoutes from "./route/notifications.js";
import searches from "./route/searches.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import './webSocketServer/index.mjs'

const app = express();
dotenv.config();

app.set('trust proxy', 1);

const apiLimiter = rateLimit({
   windowsMs: 15 * 60 * 1000,
   max: 100,
   message: "Too many requests from this IP, please try again after 15 minutes",
   standardHeaders: true,
   legacyHeaders: false,
});

app.use(cors());
app.use('/posts', apiLimiter);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/posts", postsRoutes);
app.use("/user", userRoutes);
app.use("/chats", chatsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/search", searches);

// const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb://127.0.0.1:27017/fakeshion')
    .then(() => app.listen(4000, () => console.log(`Server running on port: 4000`)))
    .catch((error) => console.log(error.message));

