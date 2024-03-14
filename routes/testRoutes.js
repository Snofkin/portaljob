import express from "express";
import { testPostController } from "../controllers/testController.js";
import userAuth from "../middlewares/authMIddleware.js";

//router object
const router = express.Router();

//routes
router.get("/test-post",userAuth,testPostController);

//export
export default router;