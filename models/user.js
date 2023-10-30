const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  // username: {
  //   type: String,
  //   required: [true, "Please enter a valid user name."],
  //   minLength: 1,
  //   maxLength: [12, 'Username must be at most 12 letter'],
  //   unique: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  resetToken: String,
  tokenExpiration: Date
});

module.exports = model("User", userSchema);