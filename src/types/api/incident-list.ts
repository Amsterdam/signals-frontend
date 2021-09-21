// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { StatusCode } from 'signals/incident-management/definitions/types'

interface Address {
  postcode: string
  huisletter: string | null
  huisnummer: string | number
  woonplaats: string
  openbare_ruimte: string
  huisnummer_toevoeging: string
}

interface Department {
  _display: string
  id: number
  name: string
  code: string
  is_intern: boolean
  can_direct: true
  category_names: string[]
}

interface Note {
  created_by: string | null
  text: string
}

export interface IncidentListItem {
  _links: {
    self: { href: string }
  }
  _display: string
  category: {
    sub: string
    sub_slug: string
    main: string
    main_slug: string
    category_url: string
    departments: string
    created_by: string | null
    text: string | null
    deadline: string | null
    deadline_factor_3: string | null
  } | null
  id: number
  has_attachments: boolean
  location: {
    id?: number
    stadsdeel: string
    buurt_code: string | null
    area_type_code?: string | null
    area_code?: string | null
    address: Address | null
    address_text?: string | null
    geometrie: {
      type: string
      coordinates: number[]
    }
    extra_properties: Record<string, unknown> | null
    created_by?: string | null
    bag_validated?: boolean
  }
  status: {
    text: string | null
    user?: string | null
    state: StatusCode
    state_display: string
    target_api: string | null
    created_by?: string | null
    send_email?: boolean
    created_at: string
    extra_properties: Record<string, unknown> | null
  }
  reporter: {
    email: string | null
    phone: string | null
    sharing_allowed: boolean
  }
  priority: {
    priority: 'normal' | 'high' | 'low'
    created_by: string | null
  }
  notes: Note[]
  type: {
    code: 'SIG' | 'REQ' | 'QUE' | 'COM' | 'MAI'
    created_at: string
    created_by: string | null
  }
  source: string
  text: string
  text_extra: string | null
  extra_properties?: unknown | null
  created_at: string
  updated_at: string
  incident_date_start?: string | null
  incident_date_end?: string | null
  assigned_user_email: string | null
  routing_departments: Department[] | null
  has_children: boolean
  has_parent: boolean
  signal_id: string
}

export type IncidentList = IncidentListItem[]
