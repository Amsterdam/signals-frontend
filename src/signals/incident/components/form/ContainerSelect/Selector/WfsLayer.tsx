import { useMapInstance } from '@amsterdam/react-maps';
import type { Point, FeatureCollection } from 'geojson';
import type { GeoJSON as GeoJSONLayer } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { featureTolocation } from 'shared/services/map-location';
import ContainerLayer from './MarkerCluster';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '@amsterdam/arm-core/lib/constants';
import type { WfsLayerProps } from './types';
import { NO_DATA } from './types';
import { fetchWithAbort } from '@amsterdam/arm-core';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel) => {
  const { min, max } = zoomLevel;
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

const WfsLayer: React.FC<WfsLayerProps> = ({ url, options, zoomLevel }) => {
  const mapInstance = useMapInstance();
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const [bbox, setBbox] = useState('');
  const [data, setData] = useState<FeatureCollection>(NO_DATA);

  /* istanbul ignore next */
  useEffect(() => {
    function onMoveEnd() {
      setBbox(options.getBBox(mapInstance));
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

    const extent = bbox || options.getBBox(mapInstance);
    const [request, controller] = fetchWithAbort(`${url}${extent}`);

    request
      .then(async result => result.json()).then(result => {
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

  useEffect(() => {
    if (layerInstance) {
      layerInstance.clearLayers();
      data.features.forEach(feature => {
        const coordinates = (feature.geometry as Point).coordinates;
        const latlng = featureTolocation({ coordinates });
        const clusteredMarker = options.getMarker(feature, latlng);
        /* istanbul ignore else */
        if (clusteredMarker) layerInstance.addLayer(clusteredMarker);
      });
    }

    return () => {
      if (layerInstance) {
        // This ensures that for each refresh of the data, the click
        // events that are bound in the layer data are removed.
      }
    };
  }, [layerInstance, data, options]);

  return <ContainerLayer setLayerInstance={setLayerInstance} />;
};

export default WfsLayer;
