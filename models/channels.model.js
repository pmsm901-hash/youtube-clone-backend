import mongoose from "mongoose";

const channelSchema=mongoose.Schema(
{
    channelName:{
        type:string,
        reuired:true,
        trim:true

    },
    description:{
        type:String,
        default:"",
    },
    channelBanner:{
        type:String,
        default:"",
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subscribers:{
        type:Number,
        default:0
    }
},
{
    timestamp:true
}

)
export default mongoose.model("Channel",channelSchema);