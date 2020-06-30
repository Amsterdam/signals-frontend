import styled from 'styled-components';
import { Button as AscButton } from '@datapunt/asc-ui';

const Button = styled(AscButton)`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal !important;

  svg path {
    fill: inherit;
  }
`;

export default Button;
