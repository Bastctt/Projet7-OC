const mongoose = require('mongoose');
const uniqueValidatorPlugin = require('mongoose-unique-validator');

const userModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

userModel.plugin(uniqueValidatorPlugin);

const User = mongoose.model('User', userModel);

module.exports = User;
