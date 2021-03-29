export interface History {
  identifier: string;
  when: string;
  what: string;
  action: string;
  description?: string | null;
  who: string;
  _category: number;
}
