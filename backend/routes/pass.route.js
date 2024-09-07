import express from "express";
import { savePasswords, getPasswords } from "../controllers/pass.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import { savePasswordLimiter, retrievePasswordLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
    
router.post('/savePasswords', checkUserAuth,  savePasswordLimiter, savePasswords);
router.post('/getPasswords', checkUserAuth,  retrievePasswordLimiter, getPasswords);

export default router;
