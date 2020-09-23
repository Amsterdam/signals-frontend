import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Radio as AscRadio, themeSpacing } from '@datapunt/asc-ui';

const Wrapper = styled.div`
  position: relative;
  z-index: 0;

  & > * {
    margin-left: ${themeSpacing(-1)};
  }
`;

const RadioButton = ({ className, ...props }) => (
  <Wrapper className={className}>
    <AscRadio {...props} />
  </Wrapper>
);

RadioButton.defaultProps = {
  className: '',
};

RadioButton.propTypes = {
  className: PropTypes.string,
};

export default RadioButton;
