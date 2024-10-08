import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";
import passRoutes from "./routes/pass.route.js";

import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/db.js";

const app = express();
// dotenv.config();
const PORT = ENV_VARS.PORT;
// const __dirname = path.resolve();

app.use(express.json()); // hey express, parse incoming requests with JSON payloads
app.use(cookieParser()); // hey express, parse cookies
app.use(
  cors({
    origin: [
      "https://shoob-pass-secure-store-wrqx.vercel.app",
      "http://localhost:5173",
    ],
    // origin: [
    //   "http://localhost:5173", // hey express, allow requests from this origin
    //   "https://shoob-pass-secure-store-wrqx.vercel.app" // Production URL
    // ],
    credentials: true, // hey express, allow cookies to be sent back and forth
  })
);

app.use("/api/auth", authRoutes); // hey express, use the authRoutes for any requests that start with /api/auth
// this is done to keep the codebase clean and modular
app.use("/api/pass", passRoutes); // hey express, use the passRoutes for any requests that start with /api/pass

// console.log(process.env.MONGODB_URI);

// to serve the frontend in production
// so with this we can access the react app using the port of the backend

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist"))); // dist is from running build from the package.json in the frontend  and __dirname means under root
//   app.get("*", (req, res) => {
//     // for any other routes other than the backend api routes
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     path.resolve(__dirname, "frontend", "build", "index.html");
//   });
// }

app.listen(PORT, () => {
  // console.log('Server is running on http://localhost:' + PORT);
  connectDB();
});
