import { useMapInstance } from '@amsterdam/react-maps';
import L from 'leaflet';
import type { Point, FeatureCollection } from 'geojson';
import type { GeoJSON as GeoJSONLayer, LatLng, Map } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { fetchWithAbort } from '@amsterdam/arm-core';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';
import MarkerCluster from 'signals/incident-management/containers/IncidentOverviewPage/components/OverviewMap/components/MarkerCluster';
import { featureTolocation } from 'shared/services/map-location';

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
  options: {
    pointToLayer: (feature: any, latlng: LatLng) => L.Marker;
  };
  zoomLevel: ZoomLevel;
}

const isVisible = (mapInstance: Map, zoomLevel: ZoomLevel) => {
  const { min, max } = zoomLevel;
  const zoom = mapInstance.getZoom();
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

const clusterLayerOptions: L.MarkerClusterGroupOptions = {
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  chunkedLoading: true,

  iconCreateFunction: cluster => {
    const childCount = cluster.getChildCount();

    return new L.DivIcon({
      html: `<div data-testid="markerClusterIcon"><span>${childCount}</span></div>`,
      className: 'marker-cluster',
      iconSize: new L.Point(40, 40),
    });
  },
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

const WfsLayer: React.FC<WfsLayerProps> = ({ url, options, zoomLevel }) => {
  const mapInstance = useMapInstance();
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const [bbox, setBbox] = useState('');
  const [data, setData] = useState<FeatureCollection>(NO_DATA);

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
      setData(NO_DATA);
      return;
    }

    const extent = bbox || getBBox(mapInstance);
    const [request, controller] = fetchWithAbort(`${url}${extent}`);

    request
      .then(async res => res.json())
      .then(res => { setData(res); return null; })
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
      data.features.forEach(feature => {
        const coordinates = (feature.geometry as Point).coordinates;
        const latlng = featureTolocation({ coordinates });
        const clusteredMarker = options.pointToLayer(feature, latlng);
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

  return <MarkerCluster clusterOptions={clusterLayerOptions} setInstance={setLayerInstance} />;
};

export default WfsLayer;
