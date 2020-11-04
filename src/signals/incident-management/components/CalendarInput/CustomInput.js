import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Calendar } from '@amsterdam/asc-assets';
import { styles } from '@amsterdam/asc-ui';

import Label from 'components/Label';

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
    <Label htmlFor={id}>{label}</Label>

    <InputWrapper data-testid="calendarCustomInputElement">
      <Input id={id} {...props} ref={ref} />
      <Calendar width={24} height={24} />
    </InputWrapper>
  </Fragment>
));

CustomInput.propTypes = {
  /** HTMLLabelElement text label */
  label: PropTypes.string.isRequired,
  /** HTMLInputElement id attribute; used for referencing with an HTMLLabelElement */
  id: PropTypes.string.isRequired,
  /** The rest of the props is passed by react-datepicker itself */
};

export default CustomInput;
