import React from 'react';
import { MapPanelContent } from '@amsterdam/arm-core';

import IconList, { IconListItem } from 'components/IconList/IconList';

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  items: { id: string; iconUrl: string; label: string }[];
  onClose: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ items, variant, onClose }) => (
  <MapPanelContent animate data-testid="legendPanel" title="Legenda" stackOrder={1} onClose={onClose} variant={variant}>
    <IconList data-testid="legendPanelList">
      {items.map(item => (
        <IconListItem id={`legendPanelListItem-${item.id}`} key={item.id} iconUrl={item.iconUrl}>
          {item.label}
        </IconListItem>
      ))}
    </IconList>
  </MapPanelContent>
);

export default LegendPanel;
