import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Spinner as AscSpinner } from '@datapunt/asc-assets';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinning = styled(AscSpinner)`
  & > * {
    transform-origin: 50% 50%;
    animation: ${rotate} 2s linear infinite;
  }
`;

const Spinner = props => <Spinning data-testid="spinner" {...props} />;

export default Spinner;
