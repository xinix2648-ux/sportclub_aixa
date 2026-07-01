const sportRoomService = require("../services/sportRoom.service");
const { success } = require("../utils/api-response");

async function index(req, res, next) {
    try {
        const sportRooms = await sportRoomService.getAllSportRooms(req.query);
        return success(res, "Asignaciones obtenidas correctamente.", sportRooms);
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const sportRoom = await sportRoomService.getSportRoomById(req.params.id);
        return success(res, "Asignación obtenida correctamente.", sportRoom);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const sportRoom = await sportRoomService.createSportRoom(req.body);
        return success(res, "Asignación creada correctamente.", sportRoom, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const sportRoom = await sportRoomService.updateSportRoom(
            req.params.id,
            req.body
        );
        return success(res, "Asignación actualizada correctamente.", sportRoom);
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await sportRoomService.deleteSportRoom(req.params.id);
        return success(res, "Asignación eliminada correctamente.");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
