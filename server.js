import express, { json } from "express";
import 'dotenv/config.js'
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoutes.js"
import userRoute from "./routes/userRoute.js"
import jobRoute from "./routes/jobRoute.js"

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/auth',authRoute);
app.use('/users',userRoute);
app.use('/job',jobRoute);
app.use("/api/v1/test",testRoute);
//validation middelware
app.use(errorMiddleware);



app.listen(process.env.PORT,async ()=>{
   await  connectDB();
});




