import express from "express";
import { createChannel,getChannels,getChannelById,updateChannel,deleteChannel } from "../controllers/channel.controller/js";
import protect from "../middleware/auth.middleware.js";

const router=express.Router();
//getting all channels
router.get("/",getChannels);
//getting channel by id
router.get("/:id",getChannelById);
//creating channel
router.post("/",protect,createChannel);
//updating channel
router.put("/:id",protect.updateChannel);
//delete channel
router.delete("/:id",protect,deleteChannel);


export default router;