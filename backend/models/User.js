const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, minLength: 6 },
    profilePhoto: { type: String }
  });

module.exports = mongoose.model('user', userSchema);