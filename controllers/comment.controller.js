import Comment from "../models/comments.model.js";
import Video from "../models/videos.model.js";

//getting comments count
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: comments.length, comments });
  } catch (error) {
    next(error);
  }
};

//creating comment
export const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty" });
    }
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video Not Found" });
    }
    const comment = await Comment.create({
      video: video._id,
      user: req.user._id,
      text: text.trim(),
    });
    const populateComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar",
    );
    res
      .status(201)
      .json({
        success: true,
        message: "comment addded",
        comment: populateComment,
      });
  } catch (error) {
    next(error);
  }
};

//update comment
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "you can edit your own comment" });
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "comment cannot be empty" });
    }
    comment.text = text.trim();
    await comment.save();
    const updatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar",
    );
    res.json({
      success: true,
      message: "comment updated",
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

//delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "you can only delete your own comment",
        });
    }
    await Comment.findByIdAndDelete(comment._id);
    res.json({ success: true, message: "comment deleted" });
  } catch (error) {
    next(error);
  }
};
