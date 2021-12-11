const express = require("express");
const router = express.Router();

const role = require("../controllers/role.controller");

// router.all('*', ()=>{
//     // authenticate for any route benieth this route
// })
router
  .get("/", role.getAll)
  .get("/:id", role.getOne)
  .post("/", role.create)
  .delete("/:id", role.deleteOne)
  .delete("/", role.deleteAll)
  .patch("/:id", role.update);

module.exports = router;
