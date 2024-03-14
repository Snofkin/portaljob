import userModel from "../models/userModel.js";




export default class UserController{

      async getUser(req,res,next){
        try {
            const user = userModel.find().lean();
            return res.status(200).json({success:true , data : user});
            
        } catch (error) {
            next(error);
        }

    };



   
  async updateUser(req, res, next)  {
    const { name, email, lastName, location } = req.body;
    if (!name || !email || !lastName || !location) {
      next("Please Provide All Fields");
    }
    const user = await userModel.findOne({ _id: req.user.userId });
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;
  
    await user.save();
    const token = user.createJWT();
    res.status(200).json({
      user,
      token,
    });
  };

}