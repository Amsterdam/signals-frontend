import React, { useContext, useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useMapInstance } from '@amsterdam/react-maps';
import { fetchWithAbort } from '@amsterdam/arm-core';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import type { FeatureCollection } from 'geojson';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '@amsterdam/arm-core/lib/constants';
import type { DataLayerProps } from 'signals/incident/components/form/ContainerSelect/types';
import L from 'leaflet';
import type { Map as MapType } from 'leaflet';

import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context';
import { NO_DATA, WfsDataProvider } from './context';

const SRS_NAME = 'urn:ogc:def:crs:EPSG::4326';
const DEFAULT_ZOOM_LEVEL: ZoomLevel = {
  max: 7,
};

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel): boolean => {
  const { min, max } = zoomLevel;
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

export interface WfsLayerProps {
  children: React.ReactElement<DataLayerProps>;
  zoomLevel?: ZoomLevel;
}

const WfsLayer: FunctionComponent<WfsLayerProps> = ({ children, zoomLevel = DEFAULT_ZOOM_LEVEL }) => {
  const mapInstance = useMapInstance();
  const { meta } = useContext(ContainerSelectContext);
  const url = meta.endpoint;

  const getBbox = (map: MapType): string => {
    const bounds = map.getBounds();
    const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},${SRS_NAME}`;
    return `&${L.Util.getParamString({
      bbox,
    }).substring(1)}`;
  };

  const [bbox, setBbox] = useState('');
  const [data, setData] = useState<FeatureCollection>(NO_DATA);

  /* istanbul ignore next */
  useEffect(() => {
    function onMoveEnd() {
      setBbox(getBbox(mapInstance));
    }

    mapInstance.on('moveend', onMoveEnd);

    return () => {
      mapInstance.off('moveend', onMoveEnd);
    };
  }, [mapInstance]);

  useEffect(() => {
    if (!isLayerVisible(mapInstance.getZoom(), zoomLevel)) {
      setData(NO_DATA);
      return;
    }

    const extent = bbox || getBbox(mapInstance);
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
  }, [bbox, mapInstance, url, zoomLevel]);

  const layer = React.cloneElement(children, { featureTypes: meta.featureTypes });
  return <WfsDataProvider value={data}>{layer}</WfsDataProvider>;
};

export default WfsLayer;
