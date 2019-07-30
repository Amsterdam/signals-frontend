import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-family: "Avenir Next LT W01 Demi", arial, sans-serif;
  color: #ec0000;
  font-size: 18px;
  line-height: 25px;
`;

const Label = ({ htmlFor, ...rest }) => <StyledLabel htmlFor={htmlFor} {...rest} />; // eslint-disable-line

export default Label;
