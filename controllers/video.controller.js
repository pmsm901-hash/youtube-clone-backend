import Video from "../models/videos.model.js";
import Channel from "../models/channels.model.js";

//getting all videos
export const getVideos=async(req,res,next)=>{
    try
    {
        const {search,category}=req.query;
        const filter={};
        if(search)
        {
            filter.title={$regex:search,$option:"i"};
        }
        if(category && category!="All")
        {
            filter.category=category;
        }
        const videos=await Video.find(filter).populate("channel","channelName channel avatar").sort({createAt:-1});
        res.json({success:true,count:videos.length,videos});
    }
    catch(error)
    {
        next(error);
    }
    
}



//get single video
export const getVideoById=async(req,res,next)=>{
    try
    {
        const video=await Video.findById(req.params.id).populate("channel","channelName channelAvatar owner").populate("uploader","username avatar");
        if(!video)
        {
            return res.status(404).json({success:false,message:"Video Not Found"});
        }
        video.views +=1;
        await video.save();
        res.json({success:true,video});
    }
    catch(error)
    {
       next(error);   
    }
}

//create video
export const createVideo=async(req,res,next)=>{
    try
    {
        const {title,description,videoUrl,thumbnailUrl,category,channelId}=req.body;
        if(!title || !description || !videoUrl || !thumbnailUrl || !category || !channelId)
        {
            return res.status(400).json({success:false,message:"Required fields are missing"});

        }
        const channel=await Channel.findById(channelId);
        if(!channel)
        {
            return res.status(404).json({success:false,message:"Channel Not Found"});
        }
        if(channel.owner.toString() !== req.user._id.toString())
        {
            return res.status(403).json({success:false,message:"You can only upload to your own channel"});
            
        }
        const video=await Video.create({title,description,videoUrl,thumbnailUrl,category,channel:channelId,uploader:req.user._id});
        channel.videos.push(video._id);
        await channel.save();
        const populateVideo=await Video.findById(video._id).populate("channel","channelName channelAvatar").populate("uploader","username avatar");
        res.status(201).json({success:true,message:"video Created",populateVideo});
    }
    catch(error)
    {
        next(error);
    }

}

//update video
export const updateVideo=async(req,res,next)=>{
    try
    {
        const video=await Video.findById(req.params.id);
        if(!video)
        {
            return res.status(404).json({success:false,message:"Video Not Found..."});
        }
        if(video.uploader.toString() !== req.user._id.toString())
        {
            return res.status(403).json({success:false,message:"Not Authorized"});
        }
        const{title,description,videoUrl,thumbnailUrl,category}=req.body;
        video.title =title ?? video.title;
        video.description=description ?? video.description;
        video.videoUrl=videoUrl ?? video.videoUrl;
        video.thumbnailUrl=thumbnailUrl ?? video.thumbnailUrl;
        video.category=category ?? video.category;

        await video.save();
        res.json({success:true,message:"video updated",video});
    }
    catch(error)
    {
        next(error);
    }
}

//delete video
export const deleteVideo=async(req,res,next)=>{
    try
    {
        const video=await Video.findById(req.params.id);
        if(!video)
        {
            return res.status(404).json({success:false,message:"Video Not Found"});
        }
        if(video.uploader.toString() !== req.user._id.toString())
        {
            return res.status(403).json({success:false,message:"Not Authorized"});
        }
        await Video.findByIdAndDelete(video._id);
        await Channel.findByIdAndUpdate(video.channel,{$pull:{videos:video._id}});
        res.json({success:true,message:"video deleted"});
    }
    catch(error)
    {
        next(error);
    }
}

//like video
export const likeVideo=async(req,res,next)=>{
    try
    {
        const video=await Video.findById(req.params.id);
        if(!video)
        {
            return res.status(404).json({success:false,message:"Video Not Found"});
        }
        const userId=req.user._id.toString();
        const alreadyLiked=video.likes.some(id=>id.toString()===userId);
        if(alreadyLiked)
        {
            video.likes=video.likes.filter(id=>id.toString() !== userId)
        }
        else
        {
            video.likes.push(req.user._id);
            video.dislikes=video.dislikes.filter(id=>id.toString() !== userId);
        }
        await video.save();
        res.json({success:true,likes:video.likes.length,dislikes:video.dislikes.length});
    }
    catch(error)
    {
        next(error);
    }
}

//disliked video
export const dislikeVideo=async(req,res,next)=>{
    try
    {
        const video=await Video.findById(req.params.id);
        if(!video)
        {
            return res.status(404).json({success:false,message:"Video not found"});
        }
        const userId=req.user._id.toString();
        const alreadyDisliked=video.dislikes.some(id=>id.toString() === userId);
        if(alreadyDisliked)
        {
            video.dislikes=video.dislikes.filter(id=>id.toString() !== userId);
        }
        else
        {
            video.dislikes.push(req.user._id);
            video.likes=video.likes.filter(id=>id.toString() !== userId);
        }
        await video.save();
        res.json({success:true,likes:video.likes.length,dislikes:video.dislikes.length});
    }
    catch(error)
    {
        next(error);
    }
}