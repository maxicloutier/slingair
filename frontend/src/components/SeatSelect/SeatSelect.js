import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plane from './Plane';
import Form from './Form';
import { useHistory } from 'react-router-dom';

const { v4: uuidv4 } = require('uuid');

const SeatSelect = ({ setBookingDetails }) => {
  const initialState = {
    _id: uuidv4(),
    flight: '',
    seat: '',
    givenName: '',
    surname: '',
    email: '',
  };

  const [flightNumbers, setFlightNumbers] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState();
  const [formData, setFormData] = useState(initialState);
  const [seatId, setSeatId] = useState();

  useEffect(() => {
    fetch('/flights')
      .then((res) => res.json())
      .then((data) => {
        setFlightNumbers(data.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Error', err);
      });
  }, []);

  const handleFlightNumber = (ev) => {
    setSelectedFlight(ev.target.value);
  };

  const handleChangeInput = (value, name) => {
    const newFormData = { ...formData };
    newFormData[name] = value;
    setFormData(newFormData);
  };

  let history = useHistory();

  const handleClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const data = {
      _id: uuidv4(),
      flight: selectedFlight,
      seat: seatId,
      givenName: formData.givenName,
      surname: formData.surname,
      email: formData.email,
    };
    localStorage.setItem('_id', data._id);
    localStorage.setItem('flight', data.flight);
    localStorage.setItem('seat', data.seat);
    localStorage.setItem('givenName', data.givenName);
    localStorage.setItem('surname', data.surname);
    localStorage.setItem('email', data.email);

    setBookingDetails(data);

    fetch('/add-reservations', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    history.push('/confirmed');
  };

  return (
    <Wrapper>
      {isLoaded && (
        <SelectFlightContainer>
          <SelectFlight>
            <label for="flightNumber">Flight Number :</label>
            <DropDown
              name="flightNumber"
              id="flightNumber"
              onChange={handleFlightNumber}
              value={selectedFlight}
            >
              <option value="" disabled selected>
                Select a flight
              </option>
              {flightNumbers.map((flightNumber) => {
                return (
                  <option value={flightNumber} key={flightNumber}>
                    {flightNumber}
                  </option>
                );
              })}
            </DropDown>
          </SelectFlight>
        </SelectFlightContainer>
      )}
      <div>
        <h2>Select your seat and provide your information!</h2>
        <BookingContainer>
          <Plane
            _id={selectedFlight}
            setSeatId={setSeatId}
            formData={formData}
            setFormData={setFormData}
          />
          <Form
            seatId={seatId}
            formData={formData}
            setFormData={setFormData}
            handleClick={handleClick}
            handleChangeInput={handleChangeInput}
            selectedFlight={selectedFlight}
          />
        </BookingContainer>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: fit-content;
`;

const SelectFlightContainer = styled.div`
  background-color: var(--color-cadmium-red);
  height: 70px;
  position: relative;
`;

const SelectFlight = styled.div`
  position: absolute;
  top: 45%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin-left: 20px;
`;

const DropDown = styled.select`
  margin-left: 10px;
  width: 140px;
  height: 30px;
  border-radius: 7px;
  border: none;
  padding: 5px;
`;

const BookingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

export default SeatSelect;
