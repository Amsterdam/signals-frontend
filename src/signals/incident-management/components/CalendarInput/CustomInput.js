import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input } from '@datapunt/asc-ui';
import { Calendar } from '@datapunt/asc-assets';

import Label from '../Label';

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    pointer-events: none;
  }
`;

const CustomInput = ({ value, onClick, label, id }) => (
  <Fragment>
    {label && <Label htmlFor={id}>{label}</Label>}

    <InputWrapper>
      <Input id={id} value={value} onClick={onClick} />
      <Calendar width={24} height={24} />
    </InputWrapper>
  </Fragment>
);

CustomInput.defaultProps = {
  onClick: null,
  value: null,
};

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  value: PropTypes.string,
};

export default CustomInput;
