import mongoose from "mongoose";
import Video from "../models/videos.model.js";
import Channel from "../models/channels.model.js";

// ============================================================================
// GET ALL VIDEOS
// GET /api/videos
// GET /api/videos?search=react
// GET /api/videos?category=Music
// GET /api/videos?search=react&category=Education
// ============================================================================

export const getVideos = async (req, res, next) => {
    try {
        const search = String(req.query.search || "").trim();
        const category = String(req.query.category || "").trim();

        console.log("SEARCH:", search);
        console.log("CATEGORY:", category);

        const filter = {};

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (category && category.toLowerCase() !== "all") {
            filter.category = category;
        }

        console.log(
            "MONGO FILTER:",
            JSON.stringify(filter, null, 2)
        );

        const videos = await Video.find(filter)
            .populate("channel", "channelName channelAvatar")
            .populate("uploader", "username avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: videos.length,
            videos
        });

    } catch (error) {
        console.error("=================================");
        console.error("GET VIDEOS ERROR:");
        console.error(error);
        console.error("=================================");

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================================
// GET SINGLE VIDEO
// GET /api/videos/:id
// ============================================================================

export const getVideoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent MongoDB CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID"
            });
        }

        const video = await Video.findById(id)
            .populate(
                "channel",
                "channelName channelAvatar owner"
            )
            .populate(
                "uploader",
                "username avatar"
            );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video Not Found"
            });
        }

        video.views += 1;

        await video.save();

        return res.status(200).json({
            success: true,
            video
        });

    } catch (error) {
        next(error);
    }
};


// ============================================================================
// CREATE VIDEO
// POST /api/videos
// ============================================================================

export const createVideo = async (req, res, next) => {
    try {
        const {
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category,
            channelId
        } = req.body;

        if (
            !title ||
            !description ||
            !videoUrl ||
            !thumbnailUrl ||
            !category ||
            !channelId
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid channel ID"
            });
        }

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel Not Found"
            });
        }

        if (
            channel.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only upload to your own channel"
            });
        }

        const video = await Video.create({
            title: title.trim(),
            description: description.trim(),
            videoUrl: videoUrl.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            category: category.trim(),
            channel: channelId,
            uploader: req.user._id
        });

        // Make sure videos array exists
        if (!Array.isArray(channel.videos)) {
            channel.videos = [];
        }

        channel.videos.push(video._id);

        await channel.save();

        const populatedVideo = await Video.findById(video._id)
            .populate(
                "channel",
                "channelName channelAvatar"
            )
            .populate(
                "uploader",
                "username avatar"
            );

        return res.status(201).json({
            success: true,
            message: "Video Created",
            video: populatedVideo
        });

    } catch (error) {
        next(error);
    }
};


// ============================================================================
// UPDATE VIDEO
// PUT /api/videos/:id
// ============================================================================

export const updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID"
            });
        }

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video Not Found"
            });
        }

        if (
            video.uploader.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const {
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category
        } = req.body;

        if (title !== undefined) {
            video.title = title.trim();
        }

        if (description !== undefined) {
            video.description = description.trim();
        }

        if (videoUrl !== undefined) {
            video.videoUrl = videoUrl.trim();
        }

        if (thumbnailUrl !== undefined) {
            video.thumbnailUrl = thumbnailUrl.trim();
        }

        if (category !== undefined) {
            video.category = category.trim();
        }

        await video.save();

        return res.status(200).json({
            success: true,
            message: "Video Updated",
            video
        });

    } catch (error) {
        next(error);
    }
};


// ============================================================================
// DELETE VIDEO
// DELETE /api/videos/:id
// ============================================================================

export const deleteVideo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID"
            });
        }

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video Not Found"
            });
        }

        if (
            video.uploader.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }

        await Video.findByIdAndDelete(id);

        await Channel.findByIdAndUpdate(
            video.channel,
            {
                $pull: {
                    videos: video._id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Video Deleted"
        });

    } catch (error) {
        next(error);
    }
};


// ============================================================================
// LIKE VIDEO
// POST /api/videos/:id/like
// ============================================================================

export const likeVideo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID"
            });
        }

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video Not Found"
            });
        }

        const userId = req.user._id.toString();

        const alreadyLiked = video.likes.some(
            (likeId) => likeId.toString() === userId
        );

        if (alreadyLiked) {

            video.likes = video.likes.filter(
                (likeId) =>
                    likeId.toString() !== userId
            );

        } else {

            video.likes.push(req.user._id);

            video.dislikes = video.dislikes.filter(
                (dislikeId) =>
                    dislikeId.toString() !== userId
            );
        }

        await video.save();

        return res.status(200).json({
            success: true,
            likes: video.likes.length,
            dislikes: video.dislikes.length
        });

    } catch (error) {
        next(error);
    }
};


// ============================================================================
// DISLIKE VIDEO
// POST /api/videos/:id/dislike
// ============================================================================

export const dislikeVideo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID"
            });
        }

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video Not Found"
            });
        }

        const userId = req.user._id.toString();

        const alreadyDisliked = video.dislikes.some(
            (dislikeId) =>
                dislikeId.toString() === userId
        );

        if (alreadyDisliked) {

            video.dislikes = video.dislikes.filter(
                (dislikeId) =>
                    dislikeId.toString() !== userId
            );

        } else {

            video.dislikes.push(req.user._id);

            video.likes = video.likes.filter(
                (likeId) =>
                    likeId.toString() !== userId
            );
        }

        await video.save();

        return res.status(200).json({
            success: true,
            likes: video.likes.length,
            dislikes: video.dislikes.length
        });

    } catch (error) {
        next(error);
    }
};