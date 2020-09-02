import React from 'react';
import styled from 'styled-components';
import { ErrorMessage as AscErrorMessage } from '@datapunt/asc-ui';

const StyledErrorMessage = styled(AscErrorMessage)`
  font-family: Avenir Next LT W01 Demi;
  font-weight: normal;
`;

const ErrorMessage = props => <StyledErrorMessage {...props} />;

export default ErrorMessage;
