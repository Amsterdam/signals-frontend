import type { StatusCode } from 'signals/incident-management/definitions/statusList';
import type Category from './category';

export default interface Incident {
  _display?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
  category?: Category | string;
  notes?: {
    text?: string;
    created_by?: string;
  }[];
  priority?: {
    priority?: string;
  };
  signal_id?: string;
  source?: string;
  status?: {
    state?: string;
    state_display?: string;
    send_email?: boolean;
  };
  updated_at?: Date;
}

export interface IncidentSummary {
  id: string | number;
  created_at?: string;
  status?: StatusCode;
  category?: {
    main?: string;
    sub?: string;
  };
}
