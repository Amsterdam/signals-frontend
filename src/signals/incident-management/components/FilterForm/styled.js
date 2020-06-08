import FormFooter from 'components/FormFooter';

import styled, { css } from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

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

export const DatesWrapper = styled.div`
  display: flex;
  & > * + * {
    margin-left: ${themeSpacing(5)};
  }
`;

export const FormFooterWrapper = styled(FormFooter)`
  button[type="reset"] {
    order: 1;
  }
  button[type="submit"] {
    margin-left: ${themeSpacing(4)};
    order: 3;
  }
  button[type="button"] {
    order: 2;
  }
`;
