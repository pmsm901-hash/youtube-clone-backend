import dotenv from dotenv;
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";

import User from "../models/users.model.js";
import Channel from "../models/channels.model.js";
import Video from "../models/videos.model.js";
import Comment from "../models/comments.model.js";


dotenv.config();

const seedDatabase=async()=>{
    try
    {
        await connectDB();

        //clear database
        await User.deleteMany({});
        await Channel.deleteMany({});
        await Video.deleteMany({});
        await Comment.deleteMany({});

        //create password
        const password=await bcrypt.hash("password123",10);
        
        //create user
        const user1=await User.Create({username:"Puja",email:"pmsm901@gmail.com",password});
        const user2=await User.Create({username:"Bhavesh",email:"bahvesh@gmail.com",password});

        //create channel
        const channel=await Channel.Create({channelName:"Code with Puja",owner:user1._id,description:"coding tutorials",channelBanner:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            channelAvatar: "https://i.pravatar.cc/150?img=12",subscribers:5200
        });

        //add channel to user
        user1.channels.push(channel._id);
        //saving channel to user data into db
        await user1.save();

        //create Videos
        const videos=await Video.insertMany([
            {
                title:"Learn React in 30 Minutes",
                description:"A quick tutorial to get started with React",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl:"https://images.unsplash.com/photo-1633356122544-f134324a6cee",
                category:"Coding",
                channel:channel._id,
                uploader:user1._id,
                views:15200
            },
            {
                title:"JavaScript Full Course",
                description:"Learn JavaScript from beginner to advanced.",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
                category:"Coding",
                channel:channel._id,
                uploader:user1._id,
                views:25000
            },
            {
                title:"Top Gaming Moments",
                description:"Best gaming moments of the week.",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
                category:"Gaming",
                channel:channel._id,
                uploader:user1._id,
                views:43000
            },
            {
                title:"Latest Technology News",
                description:"Technology news and updates.",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
                category:"News",
                channel:channel._id,
                uploader:user1._id,
                views:12500
            },
            {
                title:"Learn Node.js",
                description:"Build backend applications with Node.js.",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                category:"Education",
                channel:channel._id,
                uploader:user1._id,
                views:18000
            },
            {
                title:"Best Music Hits",
                description:"Popular music collection.",
                videoUrl:"https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
                category:"Music",
                channel:channel._id,
                uploader:user1._id,
                views:67000
            },

        ]);
        //adding videos to channel
        channel.videos=videos.map(video=>video._id);
        await channel.save();

        //create comment
        await Comment.create({video:videos[0]._id,user:user2._id,text:"Great React tutorial! Very helpful"});
        
        console.log("Datase Seeded Successfully.....!!!");
        console.log("Demo Login");
        console.log("Email:pmsm901@gmail.com");
        console.log("Password:password123");
        
        //close mongo db connection
        await mongoose.connection.close();
        process.exit(0);
    }
    catch(error)
    {
        console.log("seeded error",error);
        await mongoose.connection.close();
        process.exit(1);
    }
}
seedDatabase();