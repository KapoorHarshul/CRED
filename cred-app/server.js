require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes"); // Authentication routes
const userRoutes = require("./routes/userRoutes"); // User-related routes (profile, etc.)

const { sequelize } = require("./models/UserModel1"); // Sequelize DB connection

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for frontend communication

// Connect to MySQL
sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL Connected");
    return sequelize.sync(); // Sync tables
  })
  .then(() => console.log("✅ Sequelize models synced"))
  .catch((err) => console.error("❌ MySQL Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes); // Authentication (Login, Register)
app.use("/api/user", userRoutes); // User profile, etc.

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
