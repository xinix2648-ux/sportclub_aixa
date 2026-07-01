const { SportRoom, Sport, Room, User } = require("../models");

async function seedSportRooms() {
    const count = await SportRoom.count();

    if (count > 0) {
        return;
    }

    const crossfit = await Sport.findOne({ where: { name: "CrossFit" } });
    const yoga = await Sport.findOne({ where: { name: "Yoga" } });
    const spinning = await Sport.findOne({ where: { name: "Spinning" } });
    const funcional = await Sport.findOne({ where: { name: "Entrenamiento Funcional" } });

    const footballRoom = await Room.findOne({ where: { name: "Cancha Fútbol 1" } });
    const yogaRoom = await Room.findOne({ where: { name: "Sala Yoga" } });
    const spinningRoom = await Room.findOne({ where: { name: "Sala Spinning" } });
    const funcionalRoom = await Room.findOne({ where: { name: "Cancha Fútbol 2" } });

    const coaches = await User.findAll({
        where: { role: "coach" }
    });

    if (coaches.length === 0) {
        console.log("No se crearon asignaciones deporte-sala: no existen usuarios coach.");
        return;
    }

    const records = [];

    if (crossfit && footballRoom && coaches[0]) {
        records.push({
            sport_id: crossfit.id,
            room_id: footballRoom.id,
            coach_id: coaches[0].id,
            observation: "Clase de CrossFit en cancha.",
            status: true
        });
    }

    if (yoga && yogaRoom && coaches.length > 1) {
        records.push({
            sport_id: yoga.id,
            room_id: yogaRoom.id,
            coach_id: coaches[1].id,
            observation: "Clase grupal de yoga.",
            status: true
        });
    }

    if (spinning && spinningRoom && coaches.length > 2) {
        records.push({
            sport_id: spinning.id,
            room_id: spinningRoom.id,
            coach_id: coaches[2].id,
            observation: "Clase de alta intensidad.",
            status: true
        });
    }

    if (funcional && funcionalRoom && coaches.length > 3) {
        records.push({
            sport_id: funcional.id,
            room_id: funcionalRoom.id,
            coach_id: coaches[3].id,
            observation: "Clase de entrenamiento funcional.",
            status: true
        });
    }

    if (records.length === 0) {
        console.log("No se crearon asignaciones deporte-sala: faltan deportes, salas o coaches.");
        return;
    }

    await SportRoom.bulkCreate(records);

    console.log("SportRooms seeded successfully.");
}

module.exports = seedSportRooms;
