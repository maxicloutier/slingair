import React from 'react';
import styled from 'styled-components';

const Form = ({
  seatId,
  selectedFlight,
  formData,
  handleClick,
  handleChangeInput,
  setFormData,
}) => {
  let readyToSubmit = false;

  if (
    selectedFlight !== '' &&
    seatId !== '' &&
    formData.givenName !== '' &&
    formData.surname !== '' &&
    formData.email !== ''
  ) {
    readyToSubmit = true;
  }

  return (
    <Wrapper>
      <TheForm onSubmit={handleClick}>
        <Input
          type="text"
          id="fname"
          name="fname"
          placeholder="First Name"
          handleChangeInput={handleChangeInput}
          onChange={(ev) => {
            setFormData({
              ...formData,
              givenName: ev.target.value,
            });
          }}
        />
        <Input
          type="text"
          id="lname"
          name="lname"
          placeholder="Last Name"
          handleChangeInput={handleChangeInput}
          onChange={(ev) => {
            setFormData({
              ...formData,
              surname: ev.target.value,
            });
          }}
        />
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          handleChangeInput={handleChangeInput}
          onChange={(ev) => {
            setFormData({
              ...formData,
              email: ev.target.value,
            });
          }}
        />
        {readyToSubmit ? (
          <Button type="submit">Confirm</Button>
        ) : (
          <Button type="submit" disabled>
            Confirm
          </Button>
        )}
      </TheForm>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-size: 16px;
  margin-top: 150px;
`;

const TheForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 25px;
  border: 3px solid var(--color-alabama-crimson);
`;

const Input = styled.input`
  margin-top: 2px;
  margin-bottom: 2px;
`;

const Button = styled.button`
  margin-top: 2px;
  margin-bottom: 2px;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 30px;
  text-align: center;
  background-color: var(--color-alabama-crimson);
  border: none;
  cursor: pointer;
  padding: 5px 0px;

  &:disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export default Form;
