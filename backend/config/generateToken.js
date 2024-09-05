import jwt from 'jsonwebtoken';
import { ENV_VARS } from './envVar.js';


export const genTokenAndSendCookie = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '8d' } );
    // please  dont  use id: userId, use userId, it is the standard
    // it caused a lot of problem and debugging
    // id: userId means id is a key and userId is the value
    // but userId is a key and value both
    // so when you try to access it, you will get undefined
    // and you will spend hours debugging it
    
    res.cookie("jwt-shoobpass", token, {
        maxAge: 12*24*60*60*1000,   // 12 days in milliseconds
        httpOnly: true , // cookie is only accessible by the server, and prevent XSS attacks cross-site scripting attacks and make it not accessible via JS
        // sameSite: "strict",  // cookie is not sent with cross-origin requests, protecting from forgery attacks
        sameSite: "none",  // cookie is sent with cross-origin requests, protecting from forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development",// cookie is only sent over HTTPS, as in dev http is false and in production it is true
        domain: ENV_VARS.NODE_ENV !== "development" ? "shoob-pass-secure-store.vercel.app" : undefined, // to make it work on subdomains
    });
    
    return token;
};