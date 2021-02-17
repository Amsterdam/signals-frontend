import React from 'react';
import type { FunctionComponent } from 'react';
import { List, Icon, themeSpacing, ListItem } from '@amsterdam/asc-ui';
import styled from 'styled-components';

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`;

interface IconListItemProps {
  iconUrl: string;
  id?: string;
  className?: string;
}

export const IconListItem: FunctionComponent<IconListItemProps> = ({ iconUrl, children, className, id }) => (
  <StyledListItem data-testid={id} className={className}>
    <StyledIcon iconUrl={iconUrl} size={40} />
    {children}
  </StyledListItem>
);

export default List;
