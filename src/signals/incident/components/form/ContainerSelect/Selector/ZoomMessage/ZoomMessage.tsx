import React, { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import { isLayerVisible } from '../services';
import { useMapInstance } from '@amsterdam/react-maps';

const ZoomMessageStyle = styled.div`
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
  showZoomMessage: boolean;
  setShowZoomMessage: (show: boolean) => void;
  zoomLevel: ZoomLevel;
}

const ZoomMessage: FunctionComponent<ZoomMessageProps> = ({ showZoomMessage, setShowZoomMessage, zoomLevel }) => {
  const mapInstance = useMapInstance();

  useEffect(() => {
    if (!mapInstance) return;

    function onZoomEnd() {
      setShowZoomMessage(!isLayerVisible(mapInstance.getZoom(), zoomLevel));
    }

    mapInstance.on('zoomend', onZoomEnd);

    return () => {
      mapInstance.off('zoomend', onZoomEnd);
    };
  }, [mapInstance, setShowZoomMessage, zoomLevel]);

  return showZoomMessage ? <ZoomMessageStyle>Zoom in om de objecten te zien</ZoomMessageStyle> : null;
};

export default ZoomMessage;
