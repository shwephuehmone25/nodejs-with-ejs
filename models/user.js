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
    required: [true, "Please enter a valid gmail."],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'Must be at least 6, got {VALUE}'],
    maxLength: 12
  },
});

module.exports = model("User", userSchema);