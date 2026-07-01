const coachService = require("../services/coach.service");
const { success } = require("../utils/api-response");

async function myClasses(req, res, next) {
    try {
        const coachId = req.user?.id;
        const data = await coachService.getMyClasses(coachId);
        return success(res, "Clases obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function mySchedules(req, res, next) {
    try {
        const coachId = req.user?.id;
        const data = await coachService.getMySchedules(coachId);
        return success(res, "Horarios obtenidos correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function myRooms(req, res, next) {
    try {
        const coachId = req.user?.id;
        const data = await coachService.getMyRooms(coachId);
        return success(res, "Salas obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function dashboard(req, res, next) {
    try {
        const coachId = req.user?.id;
        const data = await coachService.getDashboard(coachId);
        return success(res, "Dashboard obtenido correctamente.", data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    myClasses,
    mySchedules,
    myRooms,
    dashboard
};
