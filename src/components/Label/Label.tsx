import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';

interface LabelProps {
  /** When true, will render the label with a plain font instead of a bold font */
  inline?: boolean;
  /** When false, the Label component will render as an inline-block element without the red header colour */
  isGroupHeader?: boolean;
}

const Label =
  styled.label<LabelProps>`
    font-family: Avenir Next LT W01${({ inline = false }) => inline ? '-Regular' : ' Demi'}, arial, sans-serif;
    font-size: 16px;
    margin-bottom: ${themeSpacing(1)};
    display: inline-block;
    vertical-align: text-top;
    color: inherit;
    ${({ isGroupHeader = false }) => isGroupHeader &&
      css`
        font-size: 18px;
        color: ${themeColor('secondary')};
      `}
  `;

export default Label;
