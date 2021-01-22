import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapPanelContext } from '@amsterdam/arm-core';
import { MapLayers } from '@amsterdam/asc-assets';
import { Button } from '@amsterdam/asc-ui';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';

const ICON_SIZE = 20;

export interface LegendToggleButtonProps {
  isRenderingLegendPanel: boolean;
  onClick: () => void;
}

const StyledButton = styled(Button)`
  box-sizing: border-box; // Override box-sizing: content-box set by Leaflet
  min-width: 0;
`;

const LegendToggleButton: React.FC<LegendToggleButtonProps> = ({ onClick, isRenderingLegendPanel }) => {
  const { setPositionFromSnapPoint, matchPositionWithSnapPoint, variant } = useContext(MapPanelContext);

  const isDrawerOpen = !matchPositionWithSnapPoint(SnapPoint.Closed);
  const icon = { [variant === 'drawer' ? 'iconLeft' : 'icon']: <MapLayers /> };
  const isLegendPanelOpen = isDrawerOpen && isRenderingLegendPanel;
  const buttonVariant = isLegendPanelOpen ? 'secondary' : 'blank';

  const toggleLegend = () => {
    setPositionFromSnapPoint(isLegendPanelOpen ? SnapPoint.Closed : SnapPoint.Halfway);
    onClick();
  };

  return (
    <StyledButton type="button" variant={buttonVariant} iconSize={ICON_SIZE} onClick={toggleLegend} {...icon}>
      Legenda
    </StyledButton>
  );
};

export default LegendToggleButton;
