import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Input } from '@amsterdam/asc-ui';
import { Calendar } from '@amsterdam/asc-assets';

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

interface CustomInputProps {
  /** HTMLInputElement id attribute; used for referencing with an HTMLLabelElement */
  id: string;
  /** HTMLLabelElement text label */
  label: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ id, label, ...props }, ref) =>
  <Fragment>
    <Label htmlFor={id}>{label}</Label>

    <InputWrapper data-testid="calendarCustomInputElement">
      <Input id={id} {...props} ref={ref} />
      <Calendar width={24} height={24} />
    </InputWrapper>
  </Fragment>
);

export default CustomInput;
