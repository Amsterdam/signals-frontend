import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { MapPanelContent } from '@amsterdam/arm-core';

import IconList from 'components/IconList/IconList';
import type { IconListItem } from 'components/IconList/IconList';

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items?: IconListItem[];
  onClose: () => void;
}

// Prevent scrollBar on iOS due to navigation bar
const GlobalStyle = createGlobalStyle`
  body { 
    touch-action: none;
    overflow: hidden; 
  }
`;

const LegendPanel: React.FC<LegendPanelProps> = ({ items = [], title, variant, onClose }) =>
  <>
    <GlobalStyle />
    <MapPanelContent stackOrder={1} onClose={onClose} variant={variant} title={title}>
      <IconList id="legend" items={items} />
    </MapPanelContent>
  </>;

export default LegendPanel;
