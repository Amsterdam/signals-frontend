import styled from 'styled-components';
import { Button, themeColor, themeSpacing } from '@datapunt/asc-ui';

export const MetaList = styled.dl`
  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    position: relative;
    font-weight: 400;
  }

  dd {
    margin-bottom: ${themeSpacing(4)};

    &.alert {
      color: ${themeColor('secondary')};
      font-family: Avenir Next LT W01 Demi, arial, sans-serif;
    }

    .childLink:not(:first-child) {
      margin-left: ${themeSpacing(2)};
    }
  }
`;

export const EditButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`;
