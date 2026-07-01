function validateCreateSportRoom(payload) {
    const errors = [];

    if (!payload.sport_id || isNaN(Number(payload.sport_id)) || Number(payload.sport_id) < 1) {
        errors.push("Debe seleccionar un deporte válido.");
    }

    if (!payload.room_id || isNaN(Number(payload.room_id)) || Number(payload.room_id) < 1) {
        errors.push("Debe seleccionar una sala válida.");
    }

    if (!payload.coach_id || isNaN(Number(payload.coach_id)) || Number(payload.coach_id) < 1) {
        errors.push("Debe seleccionar un coach válido.");
    }

    if (payload.observation !== undefined && payload.observation.length > 255) {
        errors.push("La observación no puede superar los 255 caracteres.");
    }

    return errors;
}

function validateUpdateSportRoom(payload) {
    const errors = [];

    if (payload.sport_id !== undefined && (isNaN(Number(payload.sport_id)) || Number(payload.sport_id) < 1)) {
        errors.push("Debe seleccionar un deporte válido.");
    }

    if (payload.room_id !== undefined && (isNaN(Number(payload.room_id)) || Number(payload.room_id) < 1)) {
        errors.push("Debe seleccionar una sala válida.");
    }

    if (payload.coach_id !== undefined && (isNaN(Number(payload.coach_id)) || Number(payload.coach_id) < 1)) {
        errors.push("Debe seleccionar un coach válido.");
    }

    if (payload.observation !== undefined && payload.observation.length > 255) {
        errors.push("La observación no puede superar los 255 caracteres.");
    }

    return errors;
}

module.exports = {
    validateCreateSportRoom,
    validateUpdateSportRoom
};
