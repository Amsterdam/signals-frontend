import FormFooter from 'components/FormFooter';

import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';

export const Form = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  padding-bottom: 86px;

  column-fill: auto @media (max-width: 1020px) {
    column-gap: 60px;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

export const ControlsWrapper = styled.div`
  break-inside: avoid;
  margin-bottom: 50px;
`;

export const FilterGroup = styled.div`
  & + & {
    margin-top: 30px;
  }
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;

  &:not(:first-of-type),
  &:first-of-type:last-of-type {
    margin: ${themeSpacing(7, 0)};
  }

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

  ${({ isSection }) =>
    isSection &&
    css`
      background-color: ${themeColor('tint', 'level2')};
      padding: 15px 21px;
    `}
`;

export const DatesWrapper = styled.div`
  display: flex;
  & > :first-child {
    margin-right: ${themeSpacing(5)};
  }
`;

export const FormFooterWrapper = styled(FormFooter)`
  z-index: 2;

  button[type='reset'] {
    order: 1;
  }
  button[type='submit'] {
    margin-left: ${themeSpacing(4)};
    order: 3;
  }
  button[type='button'] {
    order: 2;
  }
`;
