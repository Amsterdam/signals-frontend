import styled from 'styled-components';
import { Button as AscButton, themeColor, themeSpacing } from '@amsterdam/asc-ui';

const Button = styled(AscButton)`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal !important;

  svg path {
    fill: inherit;
  }
`;

export const ApplicationButton = styled(Button).attrs({ variant: 'application', type: 'button' })`
  padding: ${themeSpacing(1, 4)};

  // Required for buttons that are rendered as 'Link'
  color: ${themeColor('tint', 'level7')};
`;

export default Button;
