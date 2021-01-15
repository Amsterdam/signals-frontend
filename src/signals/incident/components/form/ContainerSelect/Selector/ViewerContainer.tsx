import React, { useContext } from 'react';
import styled from 'styled-components';
import { MapPanelContext } from '@amsterdam/arm-core';
import { ViewerContainer } from '@amsterdam/asc-ui';

// Should reflect ViewerContainer props from asc-ui (which are not exported)
interface ViewerContainerProps {
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  metaData?: string[];
}

interface StyledViewerContainerProps {
  leftOffset: string;
  height: string;
}

const StyledViewerContainer = styled(ViewerContainer)<StyledViewerContainerProps>`
  left: ${({ leftOffset }) => leftOffset};
  height: ${({ height }) => height};
  z-index: 400;
  transition: height 0.3s ease-in-out;
`;

interface ViewerContainerWithMapDrawerOffsetProps extends ViewerContainerProps {
  showDesktopVariant: boolean;
  legendButton: React.ReactNode;
}

const ViewerContainerWithMapDrawerOffset: React.FC<ViewerContainerWithMapDrawerOffsetProps> = ({
  showDesktopVariant,
  legendButton,
  ...restProps
}) => {
  const { drawerPosition } = useContext(MapPanelContext);
  const height = showDesktopVariant ? '100%' : drawerPosition;
  const leftOffset = showDesktopVariant ? drawerPosition : '0';

  return (
    <StyledViewerContainer
      {...restProps}
      bottomLeft={!showDesktopVariant && legendButton}
      topLeft={showDesktopVariant && legendButton}
      height={height}
      leftOffset={leftOffset}
    />
  );
};

export default ViewerContainerWithMapDrawerOffset;
