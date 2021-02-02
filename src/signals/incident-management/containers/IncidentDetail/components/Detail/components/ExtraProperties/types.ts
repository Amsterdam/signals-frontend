export type Text = string;

export interface Checkbox {
  label: string;
  value: boolean;
}

export interface Radio {
  id: string;
  label: string;
}

export interface ContainerMapValue {
  description: string;
  type: string;
  id: string;
}

export type MapValue = string;

export type Answer = Text | Checkbox | Radio | (ContainerMapValue | MapValue)[];

export interface Item {
  id: string;
  label: string;
  answer: Answer;
  category_url: string;
}

/**
 * Legacy data format unsupported by the current API.
 */
type LegacyAnswer = Text | Checkbox | Radio;
export type LegacyItem = Record<string, LegacyAnswer>;

export interface MappedLegacyItem extends Pick<Item, 'id' | 'label'> {
  answer: LegacyAnswer;
}

