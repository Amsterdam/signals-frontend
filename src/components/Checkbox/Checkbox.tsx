import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import { Checkbox as AscCheckbox } from '@amsterdam/asc-ui';

interface CheckboxProps {
  className?: string;
}

const StyledCheckbox = styled(AscCheckbox)`
    & > * {
      margin-left: -4px;
    };
`;

const Checkbox: FunctionComponent<CheckboxProps> = props => <StyledCheckbox {...props} />;

export default Checkbox;
