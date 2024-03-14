import { error } from "console";


const errorMiddleware = (error,req,res,next)=>{


    console.log(error);
    res.status(500).json({status:false,message:"Something Went Wrong",error});


}
export default errorMiddleware;