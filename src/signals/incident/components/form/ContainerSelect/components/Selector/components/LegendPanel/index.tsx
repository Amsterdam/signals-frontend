import React from 'react';
import { MapPanelContent } from '@amsterdam/arm-core';
import styled from 'styled-components';

import IconList from 'components/IconList/IconList';
import type { IconListItem } from 'components/IconList/IconList';

const StyledMapPanelContent = styled(MapPanelContent)`
  width: initial; // Prevents content from overlapping the panel shadow
`;

export interface LegendPanelProps {
  variant: 'panel' | 'drawer';
  title: string;
  items?: IconListItem[];
  onClose: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ items = [], title, variant, onClose }) => (
  <StyledMapPanelContent
    animate
    data-testid="legend-panel"
    stackOrder={1}
    onClose={onClose}
    variant={variant}
    title={title}
  >
    <IconList id="legend-icons" items={items} />
  </StyledMapPanelContent>
);

export default LegendPanel;
