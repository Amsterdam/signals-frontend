import type { IconOptions, LatLngExpression } from 'leaflet';
import type { Point, Feature as GeoJSONFeature } from 'geojson';

export type ClickEventHandler = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

export interface Item {
  id: string;
  type: string;
  description?: string;
}

export interface FeatureType {
  label: string;
  description: string;
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
  update: (items: Item[]) => void;
  edit: ClickEventHandler;
  close: ClickEventHandler;
}

export interface DataLayerProps {
  featureTypes: FeatureType[];
}

export type FeatureProps = Record<string, string | undefined>;
export type Feature = GeoJSONFeature<Point, FeatureProps>;
