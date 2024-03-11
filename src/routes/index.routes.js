const { Router } = require("express");

const customers = require("./customers.routes");
const barbers = require("./barbers.routes");
const shifts = require("./shifts.routes");
const incomes = require("./incomes.routes");
const services = require("./services.routes");
const users = require("./users.routes");

const router = Router();

router.use("/customers", customers);
router.use("/barbers", barbers);
router.use("/shifts", shifts);
router.use("/incomes", incomes);
router.use("/services", services);
router.use("/users", users);

module.exports = router;
