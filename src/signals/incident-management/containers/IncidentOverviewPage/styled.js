// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components';
import { Column, themeSpacing, Paragraph, themeColor } from '@amsterdam/asc-ui';
import Button from 'components/Button';
import Pagination from 'components/Pagination';

export const StyledButton = styled(Button)`
  margin-left: 10px;
`;

export const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

export const NoResults = styled(Paragraph)`
  width: 100%;
  text-align: center;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  color: ${themeColor('tint', 'level4')};
`;

export const MapWrapper = styled(Column).attrs({
  span: 12,
})`
  flex-direction: column;
`;
