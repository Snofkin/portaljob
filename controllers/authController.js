import mongoose from "mongoose";
import userModel from "../models/userModel.js";

export default class AuthController {
  async userlogin(req, res,next) {
    try {
      const { email, password } = req.body;
      if (!email) next("Email is required");
      if (!password) next("Password is required");
      //checking the email and password in database
      const user = await userModel.findOne({ email });
      if (!user) next("Invalid username and password");
      
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        next("Invalid Useraname or password");
      }
        const token = user.createJWT();
        return res.status(200).json({
          success: true,
          message: "User Login Successfully",
          token: token,
        });
      
    } catch (error) {
        next(error);
    }
  }
  async registerUser(req, res, next) {
    try {
      const { name, lastName, email, password, location } = req.body;

      if (!email) next("Email is required");
      if (!name) next("name is required");
      if (!password) next("Password is required");

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        next("Email already in use");
      }
      const user = await userModel.create({
        name,
        lastName,
        email,
        password,
        location,
      });
      //token
      const token = user.createJWT();
      res.status(201).send({
        sucess: true,
        message: "User Created Successfully",
        user: {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          location: user.location,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
