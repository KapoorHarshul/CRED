const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
