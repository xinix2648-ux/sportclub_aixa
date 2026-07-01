const classScheduleService = require("../services/classSchedule.service");
const { success } = require("../utils/api-response");

async function index(req, res, next) {
    try {
        const schedules = await classScheduleService.getAllClassSchedules(req.query);
        return success(res, "Horarios obtenidos correctamente.", schedules);
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const schedule = await classScheduleService.getClassScheduleById(req.params.id);
        return success(res, "Horario obtenido correctamente.", schedule);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const schedule = await classScheduleService.createClassSchedule(req.body);
        return success(res, "Horario creado correctamente.", schedule, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const schedule = await classScheduleService.updateClassSchedule(
            req.params.id,
            req.body
        );
        return success(res, "Horario actualizado correctamente.", schedule);
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await classScheduleService.deleteClassSchedule(req.params.id);
        return success(res, "Horario eliminado correctamente.");
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
