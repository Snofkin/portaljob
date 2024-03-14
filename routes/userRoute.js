import {Router}  from "express";
import UserController from "../controllers/userController.js";
import userAuth from "../middlewares/authMIddleware.js";


const router = Router();
const userController = new UserController();


///getUser

router.get('/getUser',userController.getUser);

//updateUser
router.put("/updateUser",userAuth,userController.updateUser);



export default router;