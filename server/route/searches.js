import express from "express";
import auth from "../middleware/auth.js";
import { getSearchKeys, getAvatarsBySearch, updateSearchKeys, getDetailsBySearch, deleteSearchKey } from "../controller/searches.js";

const router = express.Router();


router.get("/keys", auth, getSearchKeys);
router.get("/avatars/:value", getAvatarsBySearch);
router.get("/details/:value", getDetailsBySearch);
router.post("/keys/update", auth, updateSearchKeys);
router.delete("/keys/:id", auth, deleteSearchKey);
// router.get("/:id", getUser);
// router.patch("/:id/follow", auth, followUser);
export default router;