import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox as AscCheckbox } from '@datapunt/asc-ui';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  z-index: 0;

  & > * {
    margin-left: -4px;
  }

  & ~ label {
    vertical-align: middle;
  }
`;

const Checkbox = ({ className, ...props }) => (
  <Wrapper className={className}>
    <AscCheckbox {...props} />
  </Wrapper>
);

Checkbox.defaultProps = {
  className: '',
};

Checkbox.propTypes = {
  className: PropTypes.string,
};

export default Checkbox;
