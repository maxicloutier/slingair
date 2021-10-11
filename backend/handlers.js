'use strict';

// Use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require('uuid');

// Use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require('./data');

// Require assert
const assert = require('assert');

// Get list of all flights
const getFlights = async (req, res) => {
  try {
    const allFlights = await req.app.locals.db
      .collection('flights')
      .find()
      .toArray();

    const flightNumbers = [];

    allFlights.forEach((flight) => {
      flightNumbers.push(flight._id);
    });

    res
      .status(200)
      .json({ status: 200, message: 'Success', data: flightNumbers });
  } catch (err) {
    res.status(400).json({ status: 400, err: 'Something went wrong' });
  }
};

// Get seating information for a specific flight
const getFlight = async (req, res) => {
  const { _id } = req.params;
  try {
    const result = await req.app.locals.db
      .collection('flights')
      .findOne({ _id });

    res
      .status(200)
      .json({ status: 200, message: 'Success', _id, data: result });
  } catch (err) {
    res.status(400).json({ status: 400, _id, err: 'Something went wrong' });
  }
};

// Create a new reservation
const addReservations = async (req, res) => {
  const { flight, seat, givenName, surname, email } = req.body;

  const query = { _id: flight };

  let availableSeat = false;

  const availability = await req.app.locals.db
    .collection('flights')
    .findOne(query);

  availability.seats.forEach((seat) => {
    if (seat.isAvailable && seat._id === req.body.seat) {
      seat.isAvailable = false;
      availableSeat = true;
    }
  });

  const newReservation = {
    _id: uuidv4(),
    ...req.body,
  };

  const newValue = { $set: { seats: availability.seats } };

  await req.app.locals.db.collection('flights').updateOne(query, newValue);

  if (availableSeat) {
    try {
      await req.app.locals.db
        .collection('reservations')
        .insertOne(newReservation);

      res
        .status(201)
        .json({ status: 201, message: 'Success', data: newReservation });
    } catch (err) {
      res.status(400).json({
        status: 400,
        err: 'Something went wrong',
      });
    }
  } else {
    res.status(400).json({
      status: 400,
      err: 'This seat is not available. Please select another seat.',
    });
  }
};

// Get list of all reservations
const getReservations = async (req, res) => {
  try {
    const allReservations = await req.app.locals.db
      .collection('reservations')
      .find()
      .toArray();

    res
      .status(200)
      .json({ status: 200, message: 'Success', data: allReservations });
  } catch (err) {
    res.status(400).json({ status: 400, err: 'Something went wrong' });
  }
};

// Get information for a specific reservation
const getSingleReservation = async (req, res) => {
  const { _id } = req.params;
  try {
    const reservation = await req.app.locals.db
      .collection('reservations')
      .findOne({ _id });

    res
      .status(200)
      .json({ status: 200, message: 'Success', _id, data: reservation });
  } catch (err) {
    res.status(400).json({ status: 400, _id, err: 'Something went wrong' });
  }
};

// Delete a reservation
const deleteReservation = async (req, res) => {
  const { _id } = req.params;
  try {
    const reservation = await req.app.locals.db
      .collection('reservations')
      .findOne({ _id });

    const result = await req.app.locals.db
      .collection('reservations')
      .deleteOne({ _id });

    if (result) {
      const query = { _id: reservation.flight };

      const availability = await req.app.locals.db
        .collection('flights')
        .findOne(query);

      availability.seats.forEach((seat) => {
        if (seat._id === reservation.seat) {
          seat.isAvailable = true;
        }
      });

      const newValue = { $set: { seats: availability.seats } };

      await req.app.locals.db.collection('flights').updateOne(query, newValue);

      res
        .status(200)
        .json({ status: 200, message: 'Success', _id, data: result });
    } else {
      res
        .status(400)
        .json({ status: 400, _id, err: 'Unable to delete the reservation' });
    }
  } catch (err) {
    res.status(400).json({ status: 400, _id, err: 'Something went wrong' });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  const { flight, seat, givenName, surname, email } = req.body;

  const { _id } = req.params;

  const query = { _id };

  try {
    const updatedReservation = {
      $set: {
        flight: flight,
        seat: seat,
        givenName: givenName,
        surname: surname,
        email: email,
      },
    };

    const oldReservation = await req.app.locals.db
      .collection('reservations')
      .findOne(query);

    await req.app.locals.db
      .collection('reservations')
      .updateOne(query, updatedReservation);

    if (updatedReservation) {
      const query = { _id: flight };

      const availability = await req.app.locals.db
        .collection('flights')
        .findOne(query);

      availability.seats.forEach((seat) => {
        if (seat._id === req.body.seat) {
          seat.isAvailable = false;
        }
        if (seat._id === oldReservation.seat) {
          seat.isAvailable = true;
        }
      });

      const newValue = { $set: { seats: availability.seats } };

      await req.app.locals.db.collection('flights').updateOne(query, newValue);

      res.status(200).json({
        status: 200,
        _id,
        message: 'Success',
        ...updatedReservation.$set,
      });
    } else {
      res
        .status(400)
        .json({ status: 400, _id, err: 'Unable to update the reservation' });
    }
  } catch (err) {
    res.status(400).json({ status: 400, _id, err: 'Something went wrong' });
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
