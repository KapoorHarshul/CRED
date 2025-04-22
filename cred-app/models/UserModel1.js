const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  token: String, // ✅ Add token field
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
