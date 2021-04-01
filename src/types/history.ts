export interface History {
  identifier: string;
  when: string;
  what: string;
  who: string;
  action: string;
  description?: string | null;
}

export interface IncidentHistory extends History {
  _signal?: string;
}

export interface CategoryHistory extends History {
  _category?: string;
}
