import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

//get comments
router.get("/video/:videoId", getComments);
//create comment
router.post("/video/:videoId", protect, createComment);
//update comment
router.put("/:id", protect, updateComment);
//delete comment
router.delete("/:id", protect, deleteComment);

export default router;
