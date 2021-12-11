const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    attachment: String,
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    }, 
    reactions: {
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
