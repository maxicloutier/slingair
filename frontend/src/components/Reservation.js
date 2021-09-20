import React from 'react';
import styled from 'styled-components';

import tombstone from '../assets/tombstone.png';

const Reservation = () => {
  const _id = localStorage.getItem('_id');
  const flight = localStorage.getItem('flight');
  const seat = localStorage.getItem('seat');
  const givenName = localStorage.getItem('givenName');
  const surname = localStorage.getItem('surname');
  const email = localStorage.getItem('email');

  return (
    <>
      {localStorage.getItem('_id') ? (
        <Wrapper>
          <BookingDiv>
            <Title>Your Reservation</Title>
            <Details>
              <b>Reservation</b> #: {_id}
            </Details>
            <Details>
              <b>Flight #:</b> {flight}
            </Details>
            <Details>
              <b>Seat #:</b> {seat}
            </Details>
            <Details>
              <b>Name:</b> {givenName} {surname}
            </Details>
            <Details>
              <b>Email:</b> {email}{' '}
            </Details>
          </BookingDiv>
          <Img>
            <StyledImg src={tombstone} alt="" />
          </Img>
        </Wrapper>
      ) : (
        <NoReservation>You have no reservation at the moment.</NoReservation>
      )}
    </>
  );
};

const Wrapper = styled.div`
  width: 100vw;
`;

const BookingDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  margin-top: 50px;
  margin: auto;
  width: 40%;
  padding: 10px;
`;

const StyledImg = styled.img`
  width: 200px;
`;

const Img = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Title = styled.p`
  font-family: var(--font-body);
  font-size: 24px;
  border-bottom: 3px solid var(--color-alabama-crimson);
  padding: 12px;
  font-weight: bolder;
`;

const Details = styled.p`
  font-family: var(--font-body);
  font-size: 18px;
  padding: 12px;
`;

const NoReservation = styled.div`
  font-family: var(--font-body);
  font-size: 34px;
  font-weight: bolder;
  padding: 25px;
  margin-top: 50px;
  margin: auto;
  width: 100%;
  text-align: center;
`;

export default Reservation;
