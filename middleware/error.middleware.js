const errorMiddleware =(err,req,res,next)=>{
    console.log(err);
    const statusCode=res.statusCode === 200 ? 500 :res.statusCode;
    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal Server Error" 
    });
};
export default errorMiddleware;