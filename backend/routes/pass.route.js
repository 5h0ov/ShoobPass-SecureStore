import express from "express";
import { savePasswords, getPasswords } from "../controllers/pass.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import { savePasswordLimiter, retrievePasswordLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
    
router.post('/savePasswords',  savePasswordLimiter, savePasswords);
router.get('/getPasswords',  retrievePasswordLimiter, getPasswords);

export default router;
