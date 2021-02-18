import type Location from './location';

export default interface Category {
  category_url: string;
  departments?: string;
  main?: string;
  main_slug?: string;
  sub?: string;
  sub_slug?: string;
  text?: string;
  created_at?: Date;
  has_attachmens?: boolean;
  id?: number;
  incident_date_end?: Date;
  incident_date_start?: Date;
  location?: Location;
}
