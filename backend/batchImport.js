// Require assert
const assert = require('assert');

// Require 'flights' and 'reservations' from ./data to transfer them to MongoDB
const { flights, reservations } = require('./data');

// Require MongoClient
const { MongoClient } = require('mongodb');

// Access the database with the `uri` saved in the `.env` file
require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const newFlights = [];

Object.keys(flights).forEach((flight) => {
  newFlights.push({
    _id: flight,
    seats: flights[flight],
  });
});

// Function to batch import the flights and reservations data in MongoDB
const batchImport = async () => {
  // Create new client
  const client = await new MongoClient(MONGO_URI, options);

  // Connect to client
  await client.connect();
  console.log('Connected');

  try {
    // Connect to database
    const db = client.db('SlingAir');

    // Declare 'allFlights' variable and transfer all flights information to 'flights' collection in MongoDB
    const allFlights = await db.collection('flights').insertMany(newFlights);

    assert.equal(newFlights.length, allFlights.insertedCount);
    console.log('Flights information transferred');

    // Declare 'allReservations' variable and transfer all booking information to 'reservations' collection in MongoDB
    const allReservations = await db
      .collection('reservations')
      .insertMany(reservations);

    assert.equal(reservations.length, allReservations.insertedCount);
    console.log('Booking information transferred');
  } catch (err) {
    console.log('Error. Data not transferred.');
  }
  // Close connection to database server
  client.close();
  console.log('Disconnected');
};

// Call function
batchImport();
