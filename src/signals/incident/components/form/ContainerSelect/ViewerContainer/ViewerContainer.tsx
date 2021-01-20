import React, { useContext } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { MapPanelContext, ViewerContainer as AscViewerContainer } from '@amsterdam/arm-core';

// Should reflect ViewerContainer props from arm-core (which are not exported)
interface AscViewerContainerProps {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  metaData?: string[];
}

interface StyledViewerContainerProps {
  leftOffset: string;
  height: string;
}

const StyledViewerContainer = styled(AscViewerContainer) <StyledViewerContainerProps>`
  left: ${({ leftOffset }) => leftOffset};
  height: ${({ height }) => height};
  z-index: 400;
  transition: height 0.3s ease-in-out;
`;

interface ViewerContainerProps extends AscViewerContainerProps {
  legendButton: ReactNode;
}

const ViewerContainer: React.FC<ViewerContainerProps> = ({
  legendButton,
  ...restProps
}) => {
  const { drawerPosition, variant } = useContext(MapPanelContext);
  const isDrawerVariant = variant === 'drawer';

  const height = isDrawerVariant ? '100%' : drawerPosition;
  const leftOffset = isDrawerVariant ? drawerPosition : '0';

  return (
    <StyledViewerContainer
      {...restProps}
      data-testid="viewer-container"
      bottomLeft={!isDrawerVariant && legendButton}
      topLeft={isDrawerVariant && legendButton}
      height={height}
      leftOffset={leftOffset}
    />
  );
};

export default ViewerContainer;
