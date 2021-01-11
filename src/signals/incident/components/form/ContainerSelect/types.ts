import type { IconOptions } from 'leaflet';

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
  options?: IconOptions;
  iconSvg: string;
  selectedIconSvg?: string;
}

export interface Options {
  className: string;
  iconSize: number[];
}

export interface Meta {
  endpoint: string ;
  featureTypes: FeatureType[];
}

export interface ContainerSelectValue {
  selection: Item[];
  location?: number[];
  meta?: Meta;
  update: (items: Item[] | null) => void;
  edit: () => void;
  close: () => void;
}
