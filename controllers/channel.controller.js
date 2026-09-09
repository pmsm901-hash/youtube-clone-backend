import Channel from "../models/channels.model.js";
import User from "../models/users.model.js";
import Video from "../models/videos.model.js";

//creating channel

export const createChannel = async (req, res, next) => {
  try {
    const { channelName, description, channelBanner, channelAvatar } = req.body;
    if (!channelName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Channel name is required",
      });
    }
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res
        .status(400)
        .json({ success: false, message: "You Already Have a Channel" });
    }
    const channel = await Channel.create({
      channelName: channelName.trim(),
      description: description?.trim() || "",
      channelBanner: channelBanner?.trim() || "",
      channelAvatar: channelAvatar?.trim() || "",
      owner: req.user._id,
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });
    const populatedChannel = await Channel.findById(channel._id)
      .populate("owner", "username avatar")
      .populate("videos");
    return res.status(200).json({
      success: true,
      message: "Channel Created",
      channel: populatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

//getting all Channels
export const getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find()
      .populate("owner", "username avatar")
      .populate("videos");
    return res.status(200).json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    next(error);
  }
};

//getting channel by id
export const getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate("videos");
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "channel Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    next(error);
  }
};

//updating channel

export const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel Not Found",
      });
    }
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not the Channel Owner",
      });
    }
    const { channelName, description, channelBanner, channelAvatar } = req.body;
    channel.channelName = channelName ?? channel.channelName;
    channel.description = description ?? channel.description;
    channel.channelBanner = channelBanner ?? channel.channelBanner;
    channel.channelAvatar = channelAvatar ?? channel.channelAvatar;

    await channel.save();
    return res.status(200).json({
      success: true,
      message: "Channel Updated",
      channel,
    });
  } catch (error) {
    next(error);
  }
};

//delete channel

export const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "channel not found",
      });
    }
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "not authorized",
      });
    }
    await Video.deleteMany({ channel: channel._id });
    await Channel.findByIdAndDelete(channel._id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { channels: channel._id },
    });
    return res.status(200).json({
      success: true,
      message: "channel deleted",
    });
  } catch (error) {
    next(error);
  }
};
