import type { FunctionComponent } from 'react';
import { useMapInstance } from '@amsterdam/react-maps';
import type { FeatureCollection } from 'geojson';
import React, { useContext, useEffect, useState } from 'react';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '@amsterdam/arm-core/lib/constants';
import type { DataLayerProps, WfsLayerProps } from '../types';

import { fetchWithAbort } from '@amsterdam/arm-core';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import ContainerSelectContext from '../context';
import { NO_DATA, WfsDataProvider } from './context';

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel) => {
  const { min, max } = zoomLevel;
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

export interface Props extends WfsLayerProps {
  children: React.ReactElement<DataLayerProps>;
}

const WfsLayer: FunctionComponent<Props> = ({ url, options, zoomLevel, children }) => {
  const mapInstance = useMapInstance();
  const { meta } = useContext(ContainerSelectContext);

  const [bbox, setBbox] = useState('');
  const [data, setData] = useState<FeatureCollection>(NO_DATA);

  /* istanbul ignore next */
  useEffect(() => {
    function onMoveEnd() {
      setBbox(options.getBbox(mapInstance));
    }

    mapInstance.on('moveend', onMoveEnd);

    return () => {
      mapInstance.off('moveend', onMoveEnd);
    };
  }, [mapInstance, options]);

  useEffect(() => {
    if (!isLayerVisible(mapInstance.getZoom(), zoomLevel)) {
      setData(NO_DATA);
      return;
    }

    const extent = bbox || options.getBbox(mapInstance);
    const [request, controller] = fetchWithAbort(`${url}${extent}`);

    request
      .then(async result => result.json())
      .then(result => {
        setData(result);
        return null;
      })
      .catch(error => {
        // Ignore abort errors since they are expected to happen.
        if (error instanceof Error && error.name === 'AbortError') {
          // eslint-disable-next-line promise/no-return-wrap
          return;
        }

        // eslint-disable-next-line no-console
        console.error('Unhnadled Error in wfs call', JSON.stringify(error));
      });

    return () => {
      controller.abort();
    };
  }, [bbox, mapInstance, options, url, zoomLevel]);

  const layer = React.cloneElement(children, { featureTypes: meta.featureTypes });
  return <WfsDataProvider value={data}>{layer}</WfsDataProvider>;
};

export default WfsLayer;
