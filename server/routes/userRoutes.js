import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      "MY_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.json(user);
});


export default router;
