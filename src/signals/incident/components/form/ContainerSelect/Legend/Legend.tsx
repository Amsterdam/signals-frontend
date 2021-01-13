import { themeSpacing } from '@amsterdam/asc-ui';
import React from 'react';
import styled from 'styled-components';

interface LegendItem {
  iconUrl: string;
  label: string;
  id: string;
}

interface LegendProps {
  items: LegendItem[];
}

const List = styled.ul`
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  line-height: ${themeSpacing(4)};
  padding: ${themeSpacing(1, 0)};
  display: flex;
  align-items: center;
`;

const StyledIcon = styled.span<{ url: string }>`
  margin-right: ${themeSpacing(2)};
  background-image: url(${({ url }) => url});
  background-size: cover;
  width: 40px;
  height: 40px;
`;

const Legend: React.FC<LegendProps> = ({ items }) =>
  <List data-testid="legend">
    {items.map(({ iconUrl, label, id }) =>
      <ListItem data-testid={`legendItem-${id}`} key={label} tabIndex={-1}>
        <React.Fragment>
          <StyledIcon url={iconUrl} />
          {label}
        </React.Fragment>
      </ListItem>
    )}
  </List>;

export default Legend;
