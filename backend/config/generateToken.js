import jwt from 'jsonwebtoken';
import { ENV_VARS } from './envVar.js';


export const genTokenAndSendCookie = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '8d' } );
    
    // res.cookie("jwt-shoobpass", token, {
    //     maxAge: 8*24*60*60*1000,   // 8 days in milliseconds
    //     httpOnly: true , // cookie is only accessible by the server, and prevent XSS attacks cross-site scripting attacks and make it not accessible via JS
    //     // sameSite: "strict",  // cookie is not sent with cross-origin requests, protecting from forgery attacks
    //     sameSite: "none",  // cookie is sent with cross-origin requests, protecting from forgery attacks
    //     secure: true,// cookie is only sent over HTTPS, as in dev http is false and in production it is true
    //     domain: ENV_VARS.NODE_ENV === "development" ? "localhost" : "shoob-pass-secure-store-wrqx.vercel.app", // domain of the cookie
    // });
    
    return token;
};