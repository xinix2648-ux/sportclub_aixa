// src/controllers/sport.controller.js
const sportService = require('../services/sport.service');
const { success, fail } = require('../utils/api-response');
const { validateSportPayload } = require('../validators/sport.validator');

async function getAll(req, res, next) {
    try {
        const filters = {};

        if (req.query.status !== undefined) {
            filters.status = req.query.status;
        }

        const sports = await sportService.listSports(filters);

        return success(res, 'Listado de deportes.', sports);
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const sport = await sportService.getSportById(req.params.id);

        return success(res, 'Deporte encontrado.', sport);
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const { isValid, errors, data } = validateSportPayload(req.body);

        if (!isValid) {
            return fail(res, 'Payload inválido.', 400, errors);
        }

        const sport = await sportService.createSport(data);

        return success(res, 'Deporte creado correctamente.', sport, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { isValid, errors, data } = validateSportPayload(req.body, {
            partial: true
        });

        if (!isValid) {
            return fail(res, 'Payload inválido.', 400, errors);
        }

        const sport = await sportService.updateSport(req.params.id, data);

        return success(res, 'Deporte actualizado correctamente.', sport);
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await sportService.deleteSport(req.params.id);

        return success(res, 'Deporte eliminado correctamente.');
    } catch (error) {
        next(error);
    }
}

async function changeStatus(req, res, next) {
    try {
        const { status } = req.body;

        if (typeof status !== 'boolean') {
            return fail(res, 'Payload inválido.', 400, { status: 'El estado debe ser verdadero o falso.' });
        }

        const sport = await sportService.changeSportStatus(req.params.id, status);

        return success(res, 'Estado del deporte actualizado correctamente.', sport);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    changeStatus
};