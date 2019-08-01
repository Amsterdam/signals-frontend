import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const LabelWrapper = styled.div`
  ${({ isSetHeader }) =>
    !isSetHeader &&
    css`
      display: inline-block;
    `}
`;

const StyledLabel = styled.label`
  font-family: 'Avenir Next LT W01 Demi', arial, sans-serif;
  font-size: 18px;
  line-height: 25px;

  ${({ isSetHeader }) =>
    isSetHeader &&
    css`
      color: #ec0000;
    `}
`;

const Label = ({ htmlFor, ...rest }) => (
  <LabelWrapper>
    <StyledLabel htmlFor={htmlFor} {...rest} />
  </LabelWrapper>
);

Label.defaultProps = {
  isSetHeader: true,
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  isSetHeader: PropTypes.bool,
};

export default Label;
