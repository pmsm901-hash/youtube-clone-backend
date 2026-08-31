import express from express;
import cors from cors;
import dotenv from dotenv;

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import channelRoutes from "./routes/channel.route.js";
import videoRoutes from "./routes/video.route.js";
import commentRoutes from "./routes/comment.route.js";

import error from "./middleware/error.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT || 8080;

//connecting DB
connectDB();

//using middleware
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Home
app.get("/",(req,res)=>{
    res.json({success:true,message:"Youtube clone is running"});
});

//using routes
app.use("/api/auth",authRoutes);
app.use("/api/channels",channelRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/comments",commentRoutes);

//route not found
app.use((req,res)=>{
    return res.status(404).json({success:false,message:"API Route Not found"});
});

//error middleware
app.use(errorMiddleware);

//server listening on given port
app.listen(PORT,()=>{
    console.log(`Server is Running at PORT ${PORT}`);
})