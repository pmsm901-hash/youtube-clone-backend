import mongoose from "mongoose";

const videoSchema=mongoose.Schema(
{
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            default:""
        },
        videoUrl:{
            type:String,
            required:true
        },
        thumbnailUrl:{
            type:String,
            required:true
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Channel",
            required:true
        },
        uploader:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        likes:{
            type:Number,
            default:0
        },
        dislikes:{
            type:Number,
            default:0
        }


},
{
    timestamps:true
}
);
export default mongoose.model("Videos",videoSchema);