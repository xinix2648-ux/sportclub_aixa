const reservationService = require("../services/reservation.service");
const { success } = require("../utils/api-response");

async function index(req, res, next) {
    try {
        const data = await reservationService.getAllReservations(req.query);
        return success(res, "Reservas obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function myReservations(req, res, next) {
    try {
        const userId = req.user?.id;
        const data = await reservationService.getMyReservations(userId);
        return success(res, "Reservas obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const userId = req.user?.id;
        const reservation = await reservationService.createReservation(userId, req.body);
        return success(res, "Reserva creada correctamente.", reservation, 201);
    } catch (error) {
        next(error);
    }
}

async function cancel(req, res, next) {
    try {
        const userId = req.user?.id;
        const reservation = await reservationService.cancelReservation(userId, req.params.id);
        return success(res, "Reserva cancelada correctamente.", reservation);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    index,
    myReservations,
    store,
    cancel
};
