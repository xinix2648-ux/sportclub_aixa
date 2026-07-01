const { Reservation, User, ClassSchedule } = require("../models");

async function seedReservations() {
    const count = await Reservation.count();

    if (count > 0) {
        return;
    }

    const user = await User.findOne({
        where: {
            role: "user"
        }
    });

    const schedule = await ClassSchedule.findOne({
        where: {
            status: true
        }
    });

    if (!user || !schedule) {
        // Missing users or schedules
        return;
    }

    await Reservation.create({
        user_id: user.id,
        class_schedule_id: schedule.id,
        status: "active",
        observation: "Reserva generada como dato inicial."
    });

    // Reservations seeded successfully
}

module.exports = seedReservations;
