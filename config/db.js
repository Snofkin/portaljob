import mongoose from "mongoose";



const connectDB = async ()=>{
    try {
       await  mongoose.connect(process.env.MONGO_DB);
    console.log(`Connection extablisg successfully ${mongoose.connection.host}`);
    } catch (error) {
        console.log(error);
        console.log(`cannot connect to database`);
    }

}
export default connectDB;