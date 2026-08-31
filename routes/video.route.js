import express from "express";
import { getVideos,getVideoById,createVideo,updateVideo,deleteVideo,likeVideo,dislikeVideo } from "../controllers/video.controller.js";

import protect from "../middleware/auth.middleware.js";

const router=express.Router();
//getting all videos
router.get("/",getVideos);
//getting video by category or search
router.get("/:id",getVideoById);
//create video
router.post("/",protect,createVideo);
//update video
router.put("/:id",protect,updateVideo);
//delete video
router.delete("/:id",deleteVideo);
//liked video
router.post("/:id/like",protect,likeVideo);
//disliked video
router.post("/:id/dislike",protect,dislikeVideo);

export default router;

