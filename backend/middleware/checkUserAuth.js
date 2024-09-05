import jwt from "jsonwebtoken";
import { User } from "../models/modelUser.js";
import { ENV_VARS } from "../config/envVar.js";
import { connectDB } from "../config/db.js";

export const checkUserAuth = async (req, res, next) => {
  try {
    await connectDB();
    const token = req.cookies["jwt-shoobpass"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Auth Error" });
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid Token", token: token, decoded: decoded });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "Invalid Token", error: error });
  }
};
