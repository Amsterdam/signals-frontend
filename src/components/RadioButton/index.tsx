// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import type { FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Radio, themeColor, themeSpacing } from '@amsterdam/asc-ui';

const Wrapper = styled.div`
  position: relative;
  z-index: 0;

  & > * {
    margin-left: ${themeSpacing(-1)};
  }
`;

const StyledRadio = styled(Radio)`
  & > input:focus {
    outline: none;
  }

  & > input:focus-visible + *   {
    border: 2px solid ${themeColor('tint', 'level7')};
  }
`;

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  id: string;
  value: string;
}

const RadioButton: FunctionComponent<RadioButtonProps> = ({ className, ...props }) => (
  <Wrapper className={className}>
    <StyledRadio {...props} data-test="test" />
  </Wrapper>
);

export default RadioButton;
