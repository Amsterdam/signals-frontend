// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
export interface MyIncidentsValue {
  email?: string
  setEmail: (email: string) => void
  incidentsList?: MyIncident[]
  setIncidentsList: (incidentsList: MyIncident[]) => void
}

export interface MyIncident {
  _links: {
    curies: {
      name: string
      href: string
    }
    self: {
      href: string
    }
  }
  _display: string
  uuid: string
  id_display: string
  text: string
  status: {
    state: string
    state_display: string
  }
  created_at: string
}

export interface Result<T> {
  count: number
  results: T[]
}
