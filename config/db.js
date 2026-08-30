import mongoose from "mongoose";

//connecting to mongodb

const mongoDB=async()=>{
    try
    {
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:${connection.connection.host}`);

    }
    catch(error)
    {
        console.log("MongoDB Connection Failed",error.message);
        process.exit(1);
    }
}
export default mongoDB;