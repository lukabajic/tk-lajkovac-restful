const mongoose = require("mongoose");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  displayName: {
    type: String,
    default: "",
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", mongoSchema);

module.exports = User;
