import { Router } from "express";
import AuthController from "../controllers/authController.js";

const router = Router();
const authController = new AuthController();

router.post('/register',authController.registerUser);
router.get('/login',authController.userlogin)

export default router;