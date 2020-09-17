import styled from 'styled-components';

import { Heading, Label, RadioGroup, themeColor, themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';

export const Title = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

export const DefinitionList = styled.dl`
  margin: 0;
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 2fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 3fr 4fr;
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
    width: 100%;
  }
`;

export const StyledRemoveButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};
  padding: 0;
  border-color: transparent;
  float: right;
`;

export const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
  background-color: ${themeColor('tint', 'level1')};
`;

export const StyledSubmitButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
`;

export const StyledFormWrapper = styled.div`
  border-top: 2px solid ${themeColor('tint', 'level3')};
  padding-top: ${themeSpacing(4)};
  margin-top: ${themeSpacing(4)};
`;

export const StyledBorderBottomWrapper = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  padding-bottom: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
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

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(6)};
`;

export const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(3)};
`;
