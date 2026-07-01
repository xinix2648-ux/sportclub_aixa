const roomService = require("../services/room.service");
const { success } = require("../utils/api-response");

async function index(req, res, next) {
    try {
        const rooms = await roomService.getAllRooms(req.query);
        return success(res, "Salas obtenidas correctamente.", rooms);
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const room = await roomService.getRoomById(req.params.id);
        return success(res, "Sala obtenida correctamente.", room);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const room = await roomService.createRoom(req.body);
        return success(res, "Sala creada correctamente.", room, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        return success(res, "Sala actualizada correctamente.", room);
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await roomService.deleteRoom(req.params.id);
        return success(res, "Sala eliminada correctamente.");
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