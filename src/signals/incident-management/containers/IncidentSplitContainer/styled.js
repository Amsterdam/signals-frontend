import styled from 'styled-components';

import { Heading, Label, RadioGroup, themeColor, themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';

export const StyledTitle = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

export const StyledDefinitionList = styled.dl`
  margin: 0;
  display: grid;
  grid-row-gap: 0;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 2fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    /* grid-template-columns: 3fr 4fr; */
  }

  dt,
  dd {
    @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
      padding: ${themeSpacing(2)} 0;
    }
  }

  dt {
    color: ${themeColor('tint', 'level5')};
    margin: 0;
    font-weight: 400;
  }

  dd {
    padding-bottom: ${themeSpacing(2)};
    font-weight: 600;
    width: 100%;
  }
`;

export const StyledButton = styled(Button)`
  width: 40%;
  background-color: ${themeColor('tint', 'level1')};
`;

export const StyledCancelButton = styled(StyledButton)`
  background-color: ${themeColor('tint', 'level1')};
`;

export const StyledSubmitButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
`;

export const StyledRadioGroup = styled(RadioGroup)`
  display: inline-flex;
`;

export const StyledLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal
  }
`;

export const StyledHeading = styled(Heading)`
  font-weight: normal;
`;

export const StyledHeading2 = styled(Heading)`
  font-weight: normal;
  margin-top: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(6)};
`;

export const StyledWrapper = styled.div`
  width: 40%;
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(6)};
`;

export const StyledForm = styled.form`
  padding: ${themeSpacing(4)};
  margin: ${themeSpacing(4)};

  display: grid;
  grid-template-columns: 80% 20%;
  /* grid-row-gap: ${themeSpacing(8)}; */

  fieldset {
    position: relative;
    padding: 0;
    margin-top: ${themeSpacing(4)};
    margin-bottom: ${themeSpacing(4)};
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-color: gray;
    border-width: 1px;
  }

  /*
  fieldset:not(:last-child):after {
    content: '';
    height: 1px;
    width: 100%;
    background: gray;
    position: absolute;
  }
  */

  & > * {
    grid-column-start: 1;
  }
`;
