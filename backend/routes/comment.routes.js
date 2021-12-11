const express = require("express");
const router = express.Router();

const comment = require("../controllers/comment.controller");

router
  .get("/", comment.getAll)
  .get("/:id", comment.getOne)
  .post("/",comment.upload, comment.create)
  .delete("/:id", comment.deleteOne)
  .delete("/", comment.deleteAll)
  .patch("/:id", comment.update);

module.exports = router;
