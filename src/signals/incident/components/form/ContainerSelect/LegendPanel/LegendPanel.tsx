import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { MapPanelContent } from '@amsterdam/arm-core';

import IconList from 'components/IconList/IconList';

interface Item {
  iconUrl: string;
  label: string;
  id: string;
}

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items?: Item[];
}

// Prevent scrollBar on iOS due to navigation bar
const GlobalStyle = createGlobalStyle`
  body { 
    touch-action: none;
    overflow: hidden; 
  }
`;

const LegendPanel: React.FC<LegendPanelProps> = ({ items = [], title, variant }) =>
  <React.Fragment>
    <GlobalStyle />
    <MapPanelContent variant={variant} title={title}>
      <IconList id="legend" items={items} size={40} />
    </MapPanelContent>
  </React.Fragment>;

export default LegendPanel;
