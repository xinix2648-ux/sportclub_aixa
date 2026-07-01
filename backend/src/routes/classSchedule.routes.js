const express = require("express");
const classScheduleController = require("../controllers/classSchedule.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/", classScheduleController.index);
router.get("/:id", classScheduleController.show);
router.post("/", authorizeRole(['admin']), classScheduleController.store);
router.put("/:id", authorizeRole(['admin']), classScheduleController.update);
router.delete("/:id", authorizeRole(['admin']), classScheduleController.destroy);

module.exports = router;
