import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';

export const DisplayValue = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - ${themeSpacing(10)});
`;

export const SaveButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

export const ButtonBar = styled.div`
  margin-top: ${themeSpacing(6)};
`;
