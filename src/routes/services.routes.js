const { Router } = require("express");

const {
  createServices,
  getServices,
  editServices,
  deleteServices,
} = require("../controllers/services.controllers");

const router = Router();

router.post("/", createServices);
router.get("/", getServices);
router.put("/:id", editServices);
router.delete("/:id", deleteServices);

module.exports = router;
