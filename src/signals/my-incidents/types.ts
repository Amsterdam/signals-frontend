// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type Location from 'types/location'

export interface MyIncidentsValue {
  email?: string
  setEmail: (email: string) => void
  incidentsList?: MyIncident[]
  incidentsDetail?: MyIncident
  setIncidentsList: (incidentsList: MyIncident[]) => void
  setIncidentsDetail: (incidentsDetail: MyIncident) => void
}

interface Attachment {
  created_at: string
  created_by: string
  href: string
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
    'sia:attachments'?: Attachment[]
  }
  _display: string
  uuid: string
  id_display: string
  location?: Location
  text: string
  status: {
    state: string
    state_display: string
  }
  created_at: string
  extra_properties?: ExtraProperties[]
}

interface ExtraProperties {
  answer: string
  category_url: string
  id: string
  label: string
}

export interface Result<T> {
  count: number
  results: T[]
}

export interface HistoryInstance {
  when: string
  what: string
  action: string
  description: string
  _signal: string
}
