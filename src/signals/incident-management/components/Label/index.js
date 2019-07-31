import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-family: "Avenir Next LT W01 Demi", arial, sans-serif;
  color: #ec0000;
  font-size: 18px;
  line-height: 25px;
`;

const Label = ({ htmlFor, ...rest }) => <StyledLabel htmlFor={htmlFor} {...rest} />;

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired
};

export default Label;
