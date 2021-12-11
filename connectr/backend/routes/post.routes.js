const express = require("express");
const router = express.Router({ strict: true });

const post = require('../controllers/post.controller')

router
  .get("/", post.getAll)
  .get("/:id", post.getOne)
  .post("/",post.upload ,post.create)
  .patch("/:id", post.update)
  .delete('/all', post.deleteAll)
  .delete("/:id", post.deleteOne);

module.exports = router;
