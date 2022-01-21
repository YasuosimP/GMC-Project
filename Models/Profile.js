const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  bio: {
    type: String,
  },
  plan: {
    type: String,
    required: true,
  },

  sexe: {
    type: String
  },
  age: {
    type: String
  },
  symptoms: {
    type: [String],
    required: true,
  }
});
module.exports = Profile = mongoose.model("profile", ProfileSchema);
