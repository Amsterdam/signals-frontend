import React, { useContext } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { ViewerContainer as AscViewerContainer } from '@amsterdam/asc-ui';
import { MapPanelContext } from '@amsterdam/arm-core';

// Should reflect ViewerContainer props from asc-ui (which are not exported)
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

const StyledViewerContainer = styled(AscViewerContainer)<StyledViewerContainerProps>`
  left: ${({ leftOffset }) => leftOffset};
  height: ${({ height }) => height};
  z-index: 400;
  transition: height 0.3s ease-in-out;
`;

interface ViewerContainerProps extends AscViewerContainerProps {
  showDesktopVariant: boolean;
  legendButton: ReactNode;
  id?: string;
}

const ViewerContainer: React.FC<ViewerContainerProps> = ({
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
      data-testid="viewer-container"
      bottomLeft={!showDesktopVariant && legendButton}
      topLeft={showDesktopVariant && legendButton}
      height={height}
      leftOffset={leftOffset}
    />
  );
};

export default ViewerContainer;
