
import { timeStamp } from "console";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import  JWT from "jsonwebtoken";


const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Name is requird"]
},
lastName:{
    type:String,
},
email:{
    type: String,
    required:[true,"Email is required"],
    unique:true,
    validate:validator.isEmail,
},
password:{
    type:String,
    minLength:[6,"Minimum 6 password length"],
    required:[true,"Password is required"],
    
},
location:{
    type:String,
    default:"Nepal",
}

},{timeStamp:true});

//middleware
 userSchema.pre("save",async function(){
    if (!this.isModified) return;
    const salt =await  bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
 });


 //JSON WEBTOKEN
userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

//cjeck password
userSchema.methods.comparePassword = async function(usrPassword){
 const isMatch = await bcrypt.compare(usrPassword,this.password);
 return isMatch;
}


export default  mongoose.model("User", userSchema);