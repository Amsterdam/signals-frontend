import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import type { FeatureCollection } from 'geojson';
import type { LatLng, Map } from 'leaflet';

export const MIN_ZOOM_LEVEL = 22;
export const MAX_ZOOM_LEVEL = 0;

export const NO_DATA: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export interface WfsLayerProps {
  url: string;
  options: {
    getMarker: (feature: any, latlng: LatLng) => L.Marker;
    getBBox: (mapInstance: Map) => string;
  };
  zoomLevel: ZoomLevel;
}

