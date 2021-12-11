const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String
    },
    attachment: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "61af868370c83eed2d5a56b5"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    reactions: {
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
