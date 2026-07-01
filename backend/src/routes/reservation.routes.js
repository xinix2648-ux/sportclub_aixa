const express = require("express");
const reservationController = require("../controllers/reservation.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

const { authorizeRole } = require("../middlewares/auth.middleware");
router.get("/", authenticate, authorizeRole(["admin"]), reservationController.index);
router.get("/my-reservations", authenticate, reservationController.myReservations);
router.post("/", authenticate, reservationController.store);
router.patch("/:id/cancel", authenticate, reservationController.cancel);

module.exports = router;
