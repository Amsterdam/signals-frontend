import React from 'react';
import { MapPanelContent } from '@amsterdam/arm-core';

import IconList from 'components/IconList/IconList';
import IconListItem from 'components/IconList/IconListItem';

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items: { id: string; iconUrl: string; label: string }[];
  onClose: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ items = [], title, variant, onClose }) => (
  <MapPanelContent animate data-testid="legendPanel" stackOrder={1} onClose={onClose} variant={variant} title={title}>
    <IconList data-testid="legendPanelList">
      {items.map(item => (
        <IconListItem key={item.id} iconUrl={item.iconUrl}>
          {item.label}
        </IconListItem>
      ))}
    </IconList>
  </MapPanelContent>
);

export default LegendPanel;
