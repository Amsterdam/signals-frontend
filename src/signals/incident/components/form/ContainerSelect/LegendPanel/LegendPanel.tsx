import { MapPanelContent } from '@amsterdam/arm-core';
import { themeSpacing } from '@amsterdam/asc-ui';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

interface Item {
  iconUrl: string;
  label: string;
  id: string;
}

interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items: Item[];
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
  pointer-events: none;
`;

const StyledIcon = styled.span<{ url: string }>`
  margin-right: ${themeSpacing(2)};
  background-image: url(${({ url }) => url});
  background-size: cover;
  width: 40px;
  height: 40px;
`;

// Prevent scrollBar on iOS due to navigation bar
const GlobalStyle = createGlobalStyle`
  body { 
    touch-action: none;
    overflow: hidden; 
  }
`;

const LegendPanel: React.FC<LegendPanelProps> = ({ items, title, variant }) => (
  <React.Fragment>
    <GlobalStyle />
    <MapPanelContent variant={variant} title={title}>
      <List data-testid="legend">
        {items.map(({ iconUrl, label, id }) => (
          <ListItem data-testid={`legendItem-${id}`} key={label} tabIndex={-1}>
            <React.Fragment>
              <StyledIcon url={iconUrl} />
              {label}
            </React.Fragment>
          </ListItem>
        ))}
      </List>
    </MapPanelContent>
  </React.Fragment>
);

export default LegendPanel;
