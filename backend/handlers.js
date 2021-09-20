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

  const newReservation = {
    _id: uuidv4(),
    ...req.body,
  };

  try {
    await req.app.locals.db
      .collection('reservations')
      .insertOne(newReservation);

    res
      .status(201)
      .json({ status: 201, message: 'Success', data: newReservation });
  } catch (err) {
    res
      .status(400)
      .json({ status: 400, data: newReservation, err: 'Something went wrong' });
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
    const result = await req.app.locals.db
      .collection('reservations')
      .deleteOne({ _id });

    res
      .status(200)
      .json({ status: 200, message: 'Success', _id, data: result });
  } catch (err) {
    res.status(400).json({ status: 400, _id, err: 'Something went wrong' });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  const { flight, seat, givenName, surname, email } = req.body;

  const { _id } = req.params;

  try {
    await req.app.locals.db.collection('reservations').updateOne(
      { _id },
      {
        $set: {
          flight: flight,
          seat: seat,
          givenName: givenName,
          surname: surname,
          email: email,
        },
      }
    );

    res.status(200).json({ status: 200, _id, message: 'Success' });
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
