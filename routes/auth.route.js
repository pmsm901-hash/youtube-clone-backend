import express from "express";
import { registerUser,getMe,loginUser } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router=express.Router();
//route for creating user
router.post("/register",registerUser);
//route for login user
router.post("/login",loginUser);
//rout for getting user
router.get("/me",protect,getMe);

export default router;