const express = require("express");
const sportRoomController = require("../controllers/sportRoom.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/", sportRoomController.index);
router.get("/:id", sportRoomController.show);
router.post("/", authorizeRole(['admin']), sportRoomController.store);
router.put("/:id", authorizeRole(['admin']), sportRoomController.update);
router.delete("/:id", authorizeRole(['admin']), sportRoomController.destroy);

module.exports = router;
