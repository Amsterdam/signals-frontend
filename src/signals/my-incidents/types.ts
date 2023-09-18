// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import type { Item } from 'shared/types/extraProperties'
import type { LegacyItems } from 'shared/types/extraProperties'
import type Location from 'types/location'
export interface MyIncidentsValue {
  setEmail: (email: string) => void
  setIncidentsList: (incidentsList: MyIncident[]) => void
  incidentsList?: MyIncident[]
  email?: string
}

interface MyIncidentAttachment {
  created_at: string
  created_by: string | null
  href: string
  caption: string | null
}

export interface MyIncident {
  _links: Links
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

interface Links {
  curies: {
    name: string
    href: string
  }
  self: {
    href: string
  }
}

export interface MyIncidentDetail extends MyIncident {
  _links: Links & { 'sia:attachments': MyIncidentAttachment[] }
  location: Location
  extra_properties?: Item[] | LegacyItems
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

export interface Email {
  email: string
}
