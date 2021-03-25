import styled, { css } from 'styled-components';
import { ErrorMessage as AscErrorMessage, themeColor, themeSpacing } from '@amsterdam/asc-ui';

// custom error message component that renders the correct font according to the design system guidelines
const ErrorMessage = styled(AscErrorMessage).attrs(() => ({
  role: 'alert',
}))`
  margin-top: 0;
  font-family: Avenir Next LT W01 Demi;
  font-weight: normal;
`;

export default ErrorMessage;

export const ErrorWrapper = styled.div<{ invalid: boolean }>`
  ${({ invalid }) =>
    invalid &&
    css`
      border-left: ${themeColor('support', 'invalid')} 2px solid;
      padding-left: ${themeSpacing(3)};
    `}
`;
