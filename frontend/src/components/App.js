import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SeatSelect from './SeatSelect';
import Confirmation from './Confirmation';
import GlobalStyles from './GlobalStyles';
import Reservation from './Reservation';

const App = () => {
  const [bookingDetails, setBookingDetails] = useState();

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header bookingDetails={bookingDetails} />
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect setBookingDetails={setBookingDetails} />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation />
          </Route>
          <Route exact path="/view-reservation">
            <Reservation />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
`;

export default App;
