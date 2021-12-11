const express = require("express");
const router = express.Router();

const network = require("../controllers/network.controller");

// router.all('*', ()=>{
//     // authenticate for any route benieth this route
// })
router
  .get("/", network.getAll)
  .get("/:id", network.getOne)
  .post("/", network.create)
  .delete("/:id", network.deleteOne)
  .delete("/", network.deleteAll)
  .patch("/:id", network.update);

module.exports = router;
