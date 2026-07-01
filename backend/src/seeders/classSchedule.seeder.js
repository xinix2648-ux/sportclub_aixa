const { ClassSchedule, SportRoom, Sport, Room } = require("../models");

async function findSportRoomBySportAndRoom(sportName, roomName) {
    return SportRoom.findOne({
        include: [
            {
                model: Sport,
                as: "sport",
                where: {
                    name: sportName
                }
            },
            {
                model: Room,
                as: "room",
                where: {
                    name: roomName
                }
            }
        ]
    });
}

async function seedClassSchedules() {
    const count = await ClassSchedule.count();

    if (count > 0) {
        return;
    }

    const crossfitClass = await findSportRoomBySportAndRoom("CrossFit", "Cancha Fútbol 1");
    const yogaClass = await findSportRoomBySportAndRoom("Yoga", "Sala Yoga");
    const spinningClass = await findSportRoomBySportAndRoom("Spinning", "Sala Spinning");
    const funcionalClass = await findSportRoomBySportAndRoom("Entrenamiento Funcional", "Cancha Fútbol 2");

    const records = [];

    if (crossfitClass) {
        records.push(
            {
                sport_room_id: crossfitClass.id,
                day_of_week: 1,
                start_time: "18:00:00",
                end_time: "19:30:00",
                status: true
            },
            {
                sport_room_id: crossfitClass.id,
                day_of_week: 3,
                start_time: "18:00:00",
                end_time: "19:30:00",
                status: true
            }
        );
    }

    if (yogaClass) {
        records.push(
            {
                sport_room_id: yogaClass.id,
                day_of_week: 2,
                start_time: "09:00:00",
                end_time: "10:00:00",
                status: true
            },
            {
                sport_room_id: yogaClass.id,
                day_of_week: 4,
                start_time: "09:00:00",
                end_time: "10:00:00",
                status: true
            }
        );
    }

    if (spinningClass) {
        records.push(
            {
                sport_room_id: spinningClass.id,
                day_of_week: 2,
                start_time: "20:00:00",
                end_time: "21:00:00",
                status: true
            },
            {
                sport_room_id: spinningClass.id,
                day_of_week: 5,
                start_time: "20:00:00",
                end_time: "21:00:00",
                status: true
            }
        );
    }

    if (funcionalClass) {
        records.push(
            {
                sport_room_id: funcionalClass.id,
                day_of_week: 6,
                start_time: "10:00:00",
                end_time: "11:30:00",
                status: true
            }
        );
    }

    if (records.length === 0) {
        console.log("No se crearon horarios: faltan asignaciones deporte-sala.");
        return;
    }

    await ClassSchedule.bulkCreate(records);

    console.log("ClassSchedules seeded successfully.");
}

module.exports = seedClassSchedules;
