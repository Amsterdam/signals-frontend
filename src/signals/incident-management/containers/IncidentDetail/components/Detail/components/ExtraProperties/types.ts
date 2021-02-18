export type TextInput = string;

export interface CheckboxInput {
  label: string;
  value: boolean;
}

export interface MultiCheckboxInput {
  id: string;
  label: string;
}

export interface RadioInput {
  id: string;
  label: string;
}

export interface ContainerMapInput {
  description: string;
  type: string;
  id: string;
}

export type MapInput = string;

export type Answer = TextInput | CheckboxInput | RadioInput | (MapInput | ContainerMapInput | MultiCheckboxInput)[];

export interface Item {
  id: string;
  label: string;
  answer: Answer;
  category_url: string;
}

/**
 * Legacy data format unsupported by the current API.
 */
export type LegacyAnswer = TextInput | CheckboxInput | RadioInput;
export type LegacyItems = Record<string, LegacyAnswer>;

export interface MappedLegacyItem extends Pick<Item, 'id' | 'label'> {
  answer: LegacyAnswer;
}

export type ExtraPropertiesTypes = Item[] | LegacyItems;
