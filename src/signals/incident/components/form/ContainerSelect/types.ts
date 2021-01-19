import type { IconOptions, LatLngExpression, Map } from 'leaflet';
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';

export type ClickEvent = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

export interface Item {
  id: string;
  type: string;
  description?: string;
  iconUrl: string;
}

export interface FeatureType {
  label?: string;
  description?: string;
  icon: FeatureIcon;
  idField: string;
  typeField: string;
  typeValue: string;
}

export interface FeatureIcon {
  options?: Partial<IconOptions>;
  iconSvg: string;
  selectedIconSvg?: string;
}

export interface Options {
  className: string;
  iconSize: number[];
}

export interface Meta extends Record<string, unknown> {
  endpoint: string;
  featureTypes: FeatureType[];
}

export interface ContainerSelectValue {
  selection: Item[];
  location: LatLngExpression;
  meta: Meta;
  update: (items: Item[] | null) => void;
  edit: () => void;
  close: () => void;
}

export interface WfsLayerProps {
  url: string;
  options: {
    getBbox: (mapInstance: Map) => string;
  };
  zoomLevel: ZoomLevel;
}

export interface DataLayerProps {
  featureTypes: FeatureType[];
}
