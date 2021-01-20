import React, { useContext } from 'react';
import styled from 'styled-components';

import { MapPanelContext } from '@amsterdam/arm-core';
import { MapLayers } from '@amsterdam/asc-assets';
import { Button } from '@amsterdam/asc-ui';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';

interface LegendPanelButtonProps {
  showDesktopVariant: boolean;
  renderLegendPanel: boolean;
  onClick: () => void;
}

const StyledButton = styled(Button)`
  box-sizing: border-box;
  min-width: 0;
`;

const LegendPanelButton: React.FC<LegendPanelButtonProps> = ({ showDesktopVariant, onClick, renderLegendPanel }) => {
  const { matchPositionWithSnapPoint, setPositionFromSnapPoint } = useContext(MapPanelContext);
  const icon = showDesktopVariant ? { iconLeft: <MapLayers /> } : { icon: <MapLayers /> };
  const isLegendPanelOpen = renderLegendPanel && !matchPositionWithSnapPoint(SnapPoint.Closed);

  const handleClick = () => {
    if (!isLegendPanelOpen) {
      setPositionFromSnapPoint(SnapPoint.Halfway);
    } else if (renderLegendPanel) {
      setPositionFromSnapPoint(SnapPoint.Closed);
    }

    onClick();
  };

  return (
    <StyledButton
      type="button"
      variant={isLegendPanelOpen ? 'secondary' : 'blank'}
      title="Legenda"
      iconSize={20}
      onClick={handleClick}
      {...icon}
    >
      Legenda
    </StyledButton>
  );
};

export default LegendPanelButton;
