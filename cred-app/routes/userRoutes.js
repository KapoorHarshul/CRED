const express = require("express");
const User = require("../models/UserModel1"); // Ensure correct import
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ Debug Log
console.log("📌 userRoutes.js Loaded");

// ✅ Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  console.log(`🛠️ Fetching user profile for: ${req.user.id}`);

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User profile fetched:", user);
    res.json(user);
  } catch (error) {
    console.error("🔥 Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Users (Protected)
router.get("/users", authMiddleware, async (req, res) => {
  console.log("📥 Incoming request to /api/users");

  try {
    const users = await User.find().select("-password");

    console.log(`✅ Users fetched: ${users.length}`);
    res.json(users);
  } catch (error) {
    console.error("🔥 Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Register a New User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📥 Registration Request:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      console.log("❌ Email already exists");
      return res.status(400).json({ message: "Email already in use" });
    }

    user = new User({ name, email, password });
    await user.save();

    console.log("✅ User registered:", user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update User Details (Protected)
router.put("/update/:id", authMiddleware, async (req, res) => {
  console.log(`🛠️ Updating user: ${req.params.id}`);

  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Remember to hash passwords in a real app

    await user.save();

    console.log("✅ User updated:", user);
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
