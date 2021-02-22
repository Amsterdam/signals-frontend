import React, { useContext } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import useLayerVisible from '../useLayerVisible';
import ContainerSelectContext from '../../context';

export const MessageStyle = styled.div`
  margin: ${themeSpacing(4, 19)};
  height: ${themeSpacing(11)};
  background-color: white;
  padding: ${themeSpacing(3, 4, 3, 4)};
  background-color: ${themeColor('support', 'focus')};
  position: absolute;
  top: 0;
  right: 0;
  z-index: 400;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    left: 0;
    width: 100%;
    margin: 0;
  }
`;

export interface ZoomMessageProps {
  zoomLevel: ZoomLevel;
}

export const ZoomMessage: FunctionComponent<ZoomMessageProps> = ({ children, zoomLevel }) => {
  const layerVisible = useLayerVisible(zoomLevel);

  return !layerVisible && <MessageStyle data-testid="zoomMessage">{children}</MessageStyle> || null;
};

export const MapMessage: FunctionComponent = () => {
  const { message } = useContext(ContainerSelectContext);

  return (message && <MessageStyle data-testid="mapMessage">{message}</MessageStyle>) || null;
};
