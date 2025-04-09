const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'  // Normal users by default
  }
});

module.exports = mongoose.model("User", UserSchema);
