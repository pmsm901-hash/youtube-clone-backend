import mongoose from "mongoose";

//creating schema for user

const userSchema=mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true

    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:""
    },
},
{
    timestamps:true
}

);
export default mongoose.model("User",userSchema);