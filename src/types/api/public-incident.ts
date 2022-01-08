// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
enum State {
  Open = 'OPEN',
  Closed = 'CLOSED',
}
export interface PublicIncident {
  _display: string
  id: number
  signal_id: string
  created_at: string
  updated_at: string
  incident_date_start: string
  incident_date_end: string
  status: {
    state: State
    state_display: string
  }
}
