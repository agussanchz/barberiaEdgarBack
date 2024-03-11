const { Router } = require("express");
const router = Router();

const {
  createUsers,
  getUsers,
  editUsers,
} = require("../controllers/users.controllers");

router.post("/", createUsers);
router.get("/", getUsers);
router.put("/:id", editUsers);

module.exports = router;
