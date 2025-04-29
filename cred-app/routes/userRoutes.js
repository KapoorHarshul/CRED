const express = require("express");
const { User } = require("../models/UserModel1"); // Sequelize model
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Debug Log
console.log("📌 userRoutes.js Loaded");

// ✅ Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  console.log(`🛠️ Fetching user profile for: ${req.user.id}`);

  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

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
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

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
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log("❌ Email already exists");
      return res.status(400).json({ message: "Email already in use" });
    }

    user = await User.create({ name, email, password });

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
    const user = await User.findByPk(req.params.id);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // 🔒 Should hash password in real app

    await user.save();

    console.log("✅ User updated:", user);
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
