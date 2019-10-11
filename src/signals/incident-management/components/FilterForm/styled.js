import styled, { css } from 'styled-components';
import { ascDefaultTheme } from '@datapunt/asc-core';
import { Button, Column } from '@datapunt/asc-ui';

export const Form = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  column-fill: auto @media (max-width: 1020px) {
    column-gap: 60px;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

export const FormFooter = styled.footer`
  border-top: 2px solid #e6e6e6;
  background: ${ascDefaultTheme.colors.bright.main};
  height: 66px;
  padding: 10px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
`;

export const ButtonContainer = styled(Column)`
  justify-content: flex-start;
`;

export const SubmitButton = styled(Button).attrs({
  color: 'secondary',
})`
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: bold;
`;

export const ResetButton = styled(Button)`
  background-color: ${ascDefaultTheme.colors.bright.main};
  margin-right: auto;
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: bold;
`;

export const CancelButton = styled(Button).attrs({
  color: 'bright',
})`
  font-family: inherit;
  margin-right: 15px;
  background-color: #b4b4b4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: bold;
`;

export const ControlsWrapper = styled.div`
  break-inside: avoid;
`;

export const FilterGroup = styled.div`
  & + & {
    margin-top: 30px;
  }
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;

  legend {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .invoer + .Label {
    margin-top: 20px;
  }

  svg {
    vertical-align: top;
  }

  ${({ isSection }) => isSection && css`
    background-color: #f5f5f5;
    padding: 15px 20px;
  `}
`;
