import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Calendar } from '@datapunt/asc-assets';
import { styles } from '@datapunt/asc-ui';

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

// Using explicit reference to defined styles for Input component; using the Input component itself
// will throw warnings, because react-datepicker cannot get a ref to the HTMLElement that is rendered
// by the Input component
const Input = styled.input`
  ${styles.InputStyle.componentStyle.rules}
`;

const CustomInput = React.forwardRef(({ id, label, ...props }, ref) => (
  <Fragment>
    {label && <Label htmlFor={id}>{label}</Label>}

    <InputWrapper>
      <Input id={id} {...props} ref={ref} />
      <Calendar width={24} height={24} />
    </InputWrapper>
  </Fragment>
));

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
