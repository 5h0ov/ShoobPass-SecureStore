import express from "express";
import { signup, login, logout, getAuth } from "../controllers/auth.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";

const router = express.Router();
    
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/getAuth", checkUserAuth, getAuth);

export default router;
