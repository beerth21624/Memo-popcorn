const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  browserId: {
    type: String,
    require: true,
    unique: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  team: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model('user', userSchema);
