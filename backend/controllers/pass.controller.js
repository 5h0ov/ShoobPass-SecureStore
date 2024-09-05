import { User } from '../models/modelUser.js';

export async function savePasswords(req, res) {
  try {
    await connectDB();
    // console.log(req.body);
    const { passwords } = req.body;
    // console.log(passwords);
    const user = await User.findById(req.user._id);
    // console.log(user);
    user.entries = passwords;
    await user.save();

    res.status(200).json({ success: true, message: 'Passwords saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export async function getPasswords(req, res) {
  try {
    await connectDB();
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, passwords: user.entries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}