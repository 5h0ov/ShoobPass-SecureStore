import { User } from "../models/modelUser.js";
import bcrypt from "bcryptjs";
import { genTokenAndSendCookie } from "../config/generateToken.js";
import { connectDB } from "../config/db.js";
// Different controllers for the app


export async function editUser(req, res) {
  try {
    await connectDB();

    const { username } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function signup(req, res) {
  try {
    await connectDB();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const exitingUserByEmail = await User.findOne({ email: email }).lean().hint({ email: 1 });

    if (exitingUserByEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be atleast 6 characters",
        });
    }

    const exitingUserByUsername = await User.findOne({ username: username }).lean().hint({ username: 1 });

    if (exitingUserByUsername) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this name",
        });
    }

    const salt = await bcrypt.genSalt(12); // gen salt to hash password, 16 is the number of rounds to generate the salt
    const hashPassword = await bcrypt.hash(password, salt); // hash password
    // 134413 => $2a$10$ewBtosq0qLyCZfpqvY7boeXLdIMB8egJ1UpRovlpW3Dlh4e2ljO8a

    // const profile_pics = [/avatar1.png/, /avatar2.png/, /avatar3.png/, /avatar4.png/, /avatar5.png/];

    // const avatar = profile_pics[Math.floor(Math.random() * profile_pics.length)];

    const newUser = new User({
      username, // dont need username: username  just do username
      email,
      password: hashPassword,
    });

    const token = genTokenAndSendCookie(newUser._id, res);

    // test with postman
    await newUser.save();

    res.status(200).json({
      success: true,
      user: {
        ...newUser._doc, // spread operator to get all the properties of the user
        // password: "", // Dont show password
      },
      token: token,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function login(req, res) {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findOne({ email: email }).lean().hint({ email: 1 }); // find user by email
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User doesnt not exist with that email",
        });
    }

    const pass = await bcrypt.compare(password, user.password); // compare password
    if (!pass) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = genTokenAndSendCookie(user._id, res);

    res.status(200).json({
      success: true,
      user : user,
      // user: {
      //   ...user._doc,
      //   // password: null, // Dont show password
      // },
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

export async function logout(req, res) {

  try {
    res.clearCookie("jwt-shoobpass");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

// Check user is authenticated or not
export async function getAuth(req, res) {
  try {
    // await connectDB();
    // console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}
