export type Text = string;

export interface Checkbox {
  label: string;
  value: boolean;
}

export interface Radio {
  id: string;
  label: string;
  info: string;
}

export interface Container {
  description: string;
  type: string;
  id: string;
}

export type StreetLightId = string;

export type Answer = Text | Checkbox | Radio | (Container | StreetLightId)[];

export interface Item {
  id: string;
  label: string;
  answer: Answer;
  category_url: string;
}

type LegacyAnswer = Text | Checkbox | Radio;

export type LegacyItem = Record<string, LegacyAnswer>;

export interface MappedLegacyItem extends Pick<Item, 'id' | 'label'> {
  answer: LegacyAnswer;
}

