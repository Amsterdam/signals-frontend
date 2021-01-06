
export type ClickEvent = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

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
  idField?: string;
  typeField?: string;
  typeValue: string;
}

export interface FeatureIcon {
  options?: Options;
  iconSvg: string;
  selectedIconSvg?: string;
}

export interface Options {
  className: string;
  iconSize: number[];
}

export interface Meta {
  featureTypes: FeatureType[];
}

export interface ContainerSelectValue {
  selection: Item[];
  location: any;
  meta: Meta;
  update: (items: Item[] | null) => void;
  edit: () => void;
  close: () => void;
}
