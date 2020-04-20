import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

export const StyledTable = styled.table`
 width: 100%;
`;

export const StyledTHead = styled.thead `
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

export const StyledTR = styled.tr`
  &:nth-of-type(2) {
    th {
      padding-top: 0;
      padding-bottom: ${themeSpacing(4)};
    }
  }
`;

export const StyledTH =  styled.th`
  border-top: none;
  border-bottom: none;
  padding: ${themeSpacing(3)} ${themeSpacing(2)};
  vertical-align: top;
`;

export const StyledTD = styled.td`
  padding: ${themeSpacing(2)};
  cursor: pointer;
`;
