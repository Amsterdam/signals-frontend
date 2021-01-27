import React from 'react';
import { MapPanelContent } from '@amsterdam/arm-core';

import IconList from 'components/IconList/IconList';
import type { IconListItem } from 'components/IconList/IconList';

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items?: IconListItem[];
  onClose: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ items = [], title, variant, onClose }) => (
  <MapPanelContent animate data-testid="legendPanel" stackOrder={1} onClose={onClose} variant={variant} title={title}>
    <IconList id="legend-icons" items={items} />
  </MapPanelContent>
);

export default LegendPanel;
