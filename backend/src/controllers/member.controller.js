const memberService = require("../services/member.service");
const { success } = require("../utils/api-response");

async function dashboard(req, res, next) {
    try {
        const data = await memberService.getDashboard();
        return success(res, "Dashboard obtenido correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function classes(req, res, next) {
    try {
        const data = await memberService.getAvailableClasses(req.query);
        return success(res, "Clases obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function classDetail(req, res, next) {
    try {
        const data = await memberService.getClassById(req.params.id);
        return success(res, "Clase obtenida correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function sports(req, res, next) {
    try {
        const data = await memberService.getAvailableSports();
        return success(res, "Deportes obtenidos correctamente.", data);
    } catch (error) {
        next(error);
    }
}

async function rooms(req, res, next) {
    try {
        const data = await memberService.getAvailableRooms();
        return success(res, "Salas obtenidas correctamente.", data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    dashboard,
    classes,
    classDetail,
    sports,
    rooms
};

