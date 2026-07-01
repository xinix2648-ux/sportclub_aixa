const { Router } = require('express');
const roomController = require("../controllers/room.controller");
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);
router.get("/", roomController.index);
router.get("/:id", roomController.show);
router.post("/", authorizeRole(['admin']), roomController.store);
router.put("/:id", authorizeRole(['admin']), roomController.update);
router.delete("/:id", authorizeRole(['admin']), roomController.destroy);

module.exports = router;