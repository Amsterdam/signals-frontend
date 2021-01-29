import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapPanelContext } from '@amsterdam/arm-core';
import { MapLayers } from '@amsterdam/asc-assets';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import Button from 'components/Button';

const ICON_SIZE = 20;

export interface LegendToggleButtonProps {
  isRenderingLegendPanel: boolean;
  onClick: () => void;
}

const StyledButton = styled(Button)`
  min-width: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

  svg path {
    fill: currentColor;
  }
`;

const LegendToggleButton: React.FC<LegendToggleButtonProps> = ({ onClick, isRenderingLegendPanel }) => {
  const { setPositionFromSnapPoint, matchPositionWithSnapPoint, variant } = useContext(MapPanelContext);

  const isDrawerOpen = !matchPositionWithSnapPoint(SnapPoint.Closed);
  const icon = { [variant === 'panel' ? 'iconLeft' : 'icon']: <MapLayers /> };
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
