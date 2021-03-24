import React from 'react';
import type { FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Radio as AscRadio, themeSpacing } from '@amsterdam/asc-ui';

const Wrapper = styled.div`
  position: relative;
  z-index: 0;

  & > * {
    margin-left: ${themeSpacing(-1)};
  }
`;

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  id: string;
  value: string;
}

const RadioButton: FunctionComponent<RadioButtonProps> = ({ className, ...props }) => (
  <Wrapper className={className}>
    <AscRadio {...props} />
  </Wrapper>
);

export default RadioButton;
