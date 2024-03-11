const { Barbers, Shifts, Customers } = require("../database");
const { Op } = require("sequelize");
const moment = require("moment");
require("moment-timezone");

const createShifts = async (req, res) => {
  try {
    const barbers = await Barbers.findAll();
    const daysOfWeek = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    const today = moment().startOf("day");
    const futureDates = Array.from({ length: 15 }, (_, i) =>
      today.clone().add(i, "days")
    );

    for (const barber of barbers) {
      for (const date of futureDates) {
        if (date.day() === 0) continue;

        const dayShift = daysOfWeek[date.day() - 1];
        const startTimeMorning = moment({ hour: 10 });
        const startTimeAfternoon = moment({ hour: 15 });

        //___________________________horario mañana
        for (let i = 0; i <= 4; i++) {
          const time = startTimeMorning.format("HH:mm");
          const dateTime = moment(date)
            .hour(startTimeMorning.hour())
            .minute(startTimeMorning.minute());

          const [shift, created] = await Shifts.findOrCreate({
            where: { dateTime, date, time, day: dayShift, barber: barber.name },
          });

          if (created) {
            await shift.addBarbers(barber);
          }

          startTimeMorning.add(40, "minutes");
        }

        //___________________________horario tarde
        for (let i = 0; i <= 8; i++) {
          const time = startTimeAfternoon.format("HH:mm");
          const dateTime = moment(date)
            .hour(startTimeAfternoon.hour())
            .minute(startTimeAfternoon.minute());

          const [shift, created] = await Shifts.findOrCreate({
            where: { dateTime, date, time, day: dayShift, barber: barber.name },
          });

          if (created) {
            await shift.addBarbers(barber);
          }

          startTimeAfternoon.add(40, "minutes");
        }
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in createShifts", error);
  }
};

//_____________________________________________________________

const getShifts = async (req, res) => {
  try {
    await deleteShifts();
    
    let shifts = await Shifts.findAll({
      order: [
        ["barber", "ASC"],
        ["date", "ASC"],
        ["time", "ASC"],
      ],
      include: {
        model: Barbers,
        model: Customers,
      },
    });
    return res.status(200).send(shifts);
  } catch (error) {
    console.error("Error in getShifts", error);
  }
};

//_____________________________________________________________
// probablemente no se use

const getShiftsId = async (req, res) => {
  try {
    let shifts = await Shifts.findByPk(req.params.id);
    return res.status(200).send(shifts);
  } catch (error) {
    console.error("Error in getShiftsId", error);
  }
};

//_____________________________________________________________
//Se usa para habilitar/deshabilitar turnos segun preferencia del barbero

const editShifts = async (req, res) => {
  try {
    const shift = await Shifts.findOne({ where: { id: req.params.id } });
    const newOccupied = !shift.occupied;
    await shift.update({ occupied: newOccupied });

    const updatedShift = await Shifts.findOne({ where: { id: req.params.id } });
    return res.status(200).send(updatedShift);
  } catch (error) {
    console.error("Error in editShifts", error);
  }
};

const editShiftsOfTheDay = async (req, res) => {
  try {
    const { barber, date, occupied } = req.query;
    console.log(req.query, "asdasd");

    const shiftsToUpdate = await Shifts.findAll({
      where: {
        barber: barber,
        date: date,
      },
    });
    console.log(shiftsToUpdate, "asdsa");

    await Promise.all(
      shiftsToUpdate.map(async (shift) => {
        await shift.update({ occupied: occupied });
      })
    );

    const updatedShifts = await Shifts.findAll({
      order: [
        ["barber", "ASC"],
        ["date", "ASC"],
        ["time", "ASC"],
      ],
      include: {
        model: Barbers,
        model: Customers,
      },
    });

    return res.status(200).send(updatedShifts);
  } catch (error) {
    console.error("Error in editShiftsOfTheDay", error);
  }
};

//_____________________________________________________________
//Desabilita automaticamente los turnos del dia que ya pasaron

const disableShifts = async (req, res) => {
  try {
    const currentDateTime = moment().utcOffset(-3); // Restar 3 horas a UTC 0
    const shifts = await Shifts.findAll();

    const expiredShifts = shifts.filter((shift) => {
      const shiftDateTime = moment(shift.dateTime);
      return shiftDateTime.isBefore(currentDateTime);
    });

    if (expiredShifts.length > 0) {
      const shiftIds = expiredShifts.map((shift) => shift.id);
      await Shifts.update(
        { occupied: true },
        {
          where: {
            id: {
              [Op.in]: shiftIds,
            },
          },
        }
      );
    }

    return;
  } catch (error) {
    console.error("Error in disableShifts", error);
  }
};

//_____________________________________________________________
//Elimina turnos de dias pasados

const deleteShifts = async (req, res) => {
  try {
    const currentDate = moment();
    const shifts = await Shifts.findAll();

    const expiredShifts = shifts.filter((shift) => {
      const shiftDate = moment(shift.date);
      return shiftDate.isBefore(currentDate, "day");
    });

    if (expiredShifts.length > 0) {
      await Shifts.destroy({
        where: {
          id: {
            [Op.in]: expiredShifts.map((shift) => shift.id),
          },
        },
        include: {
        model: Customers,
      },
      });
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in deleteShifts", error);
  }
};

module.exports = {
  createShifts,
  getShifts,
  getShiftsId,
  editShifts,
  disableShifts,
  deleteShifts,
  editShiftsOfTheDay,
};
