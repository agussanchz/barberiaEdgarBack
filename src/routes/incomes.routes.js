const { Router } = require("express");

const {
  createIncomes,
  getIncomes,
  getIncomesById,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomes.controllers");

const router = Router();

router.post("/", createIncomes);
router.get("/", getIncomes);
router.get("/:id", getIncomesById);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
