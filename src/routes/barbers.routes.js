const { Router } = require("express");
const {
  createBarbers,
  getBarbers,
  editBarbers,
  deleteBarbers,
  getBarbersId,
} = require("../controllers/barbers.controllers");

const router = Router();

router.post("/", createBarbers);
router.get("/", getBarbers);
router.get("/:id", getBarbersId);
router.put("/:id", editBarbers);
router.delete("/:id", deleteBarbers);

module.exports = router;
