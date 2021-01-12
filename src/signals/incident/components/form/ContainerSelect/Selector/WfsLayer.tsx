import { useMapInstance } from '@amsterdam/react-maps';
import type { Point, FeatureCollection } from 'geojson';
import type { GeoJSON as GeoJSONLayer } from 'leaflet';
import React, { useCallback, useEffect, useState } from 'react';
import { featureTolocation } from 'shared/services/map-location';
import ContainerLayer from './MarkerCluster';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '@amsterdam/arm-core/lib/constants';
import type { WfsLayerProps } from './types';
import { NO_DATA } from './types';
import { useFetch } from 'hooks';

const WfsLayer: React.FC<WfsLayerProps> = ({ url, options, zoomLevel }) => {
  const mapInstance = useMapInstance();
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const [bbox, setBbox] = useState('');
  const [data, setData] = useState<FeatureCollection>(NO_DATA);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    data: response,
    error,
    get,
  }: { data: any; error: any; get: (url: string, params: any, options: any) => void } = useFetch();

  const isVisible = useCallback((zoom: number) => {
    const { min, max } = zoomLevel;
    return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
  }, [zoomLevel]);

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
    if (!isVisible(mapInstance.getZoom())) {
      setData(NO_DATA);
      return;
    }

    const extent = bbox || options.getBBox(mapInstance);

    // remove the authorization because we are requesting public json data
    get(`${url}${extent}`, {}, { headers: { Authorization: '' } });
  }, [bbox, get, isVisible, mapInstance, options, url]);

  useEffect(() => {
    if (response === undefined || error) {
      setData(NO_DATA);
      return;
    }

    setData(response);
  }, [response, error]);

  useEffect(() => {
    if (layerInstance && data) {
      layerInstance.clearLayers();
      data.features.forEach(feature => {
        const coordinates = (feature.geometry as Point).coordinates;
        const latlng = featureTolocation({ coordinates });
        const clusteredMarker = options.getMarker(feature, latlng);
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
