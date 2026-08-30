import mongoose  from "mongoose";

const commentSchema=mongoose.Schema(
{
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    }

},
{
    timestamp:true
}
);

export default mongoose.model("Comment",commentSchema);