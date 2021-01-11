import { GeoJSON, useMapInstance } from '@amsterdam/react-maps';
import type { FeatureCollection } from 'geojson';
import type { GeoJSON as GeoJSONLayer, GeoJSONOptions, Map } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { fetchWithAbort } from '@amsterdam/arm-core';
import L from 'leaflet';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';

export const MIN_ZOOM_LEVEL = 22;
export const MAX_ZOOM_LEVEL = 0;

const NO_DATA: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export interface ZoomLevel {
  min?: number;
  max?: number;
}

export interface WfsLayerProps {
  url: string;
  options?: GeoJSONOptions;
  zoomLevel: ZoomLevel;
}

const isVisible = (mapInstance: Map, zoomLevel: ZoomLevel) => {
  const { min, max } = zoomLevel;
  const zoom = mapInstance.getZoom();
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

const getBBox = (mapInstance: Map): string => {
  const bounds = mapInstance.getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  const wgs84SouthWest = {
    lng: southWest.lng,
    lat: southWest.lat,
  };
  const wgs84NorthEast = {
    lng: northEast.lng,
    lat: northEast.lat,
  };
  const southWestRd = wgs84ToRd(wgs84SouthWest);
  const northEastRd = wgs84ToRd(wgs84NorthEast);

  const bbox = `${southWestRd.x},${southWestRd.y},${northEastRd.x},${northEastRd.y}`;

  return `&${L.Util.getParamString({
    bbox,
  }).substring(1)}`;
};


/**
 * WfsLayer component should be only used when the api provides wfs capabilities for spatial queries
 * The data is requested on each map action (pan, zoom)
 *
 */
const WfsLayer: React.FC<WfsLayerProps> = ({ url, options, zoomLevel }) => {
  const mapInstance = useMapInstance();
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const [bbox, setBbox] = useState('');
  const [json, setJson] = useState<FeatureCollection>(NO_DATA);

  useEffect(() => {
    function onMoveEnd() {
      setBbox(getBBox(mapInstance));
    }

    mapInstance.on('moveend', onMoveEnd);

    return () => {
      mapInstance.off('moveend', onMoveEnd);
    };
  }, [mapInstance]);

  useEffect(() => {
    if (!isVisible(mapInstance, zoomLevel)) {
      setJson(NO_DATA);
      return;
    }

    const extent = bbox || getBBox(mapInstance);
    const [request, controller] = fetchWithAbort(`${url}${extent}`);

    request
      .then(async res => res.json())
      .then(res => { setJson(res); return null; })
      .catch(async error => {
        // Ignore abort errors since they are expected to happen.
        if (error instanceof Error && error.name === 'AbortError') {
          // eslint-disable-next-line promise/no-return-wrap
          return Promise.resolve(null);
        }

        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(error);
      });

    return () => { controller.abort(); };
  }, [bbox, mapInstance, url, zoomLevel]);

  useEffect(() => {
    if (layerInstance) {
      layerInstance.clearLayers();
      layerInstance.addData(json);
    }

    return () => {
      if (layerInstance) {
        // This ensures that for each refresh of the data, the click
        // events that are bound in the layer data are removed.
        layerInstance.off('click');
      }
    };
  }, [layerInstance, json]);

  return json ? <GeoJSON setInstance={setLayerInstance} args={[json]} options={options} /> : null;
};

export default WfsLayer;
