const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    contact: String,
    profileurl: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: "61af865d70c83eed2d5a56b2"
    },
    password: {
      type: String,
      required: true,
      min: [8, "min of 8 characters"]
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        max: [3, "Max number of admins reached"]
    }],
    networks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Network",
        max: [3, "This account can only belong to max of 3 networks, upgrade to premium"]
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
