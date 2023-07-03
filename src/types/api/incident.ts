// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 -2023 Gemeente Amsterdam
import type { Address } from 'types/address'
import type { Geometrie } from 'types/incident'

import type { StatusCode } from '../status-code'

export interface Department {
  _display: string
  id: number
  name: string
  code: string
  is_intern: boolean
  can_direct: true
  category_names: string[]
}

export enum Priority {
  normal = 'normal',
  high = 'high',
  low = 'low',
}

export enum TypeCode {
  SIG = 'SIG',
  REQ = 'REQ',
  QUE = 'QUE',
  COM = 'COM',
  MAI = 'MAI',
}

export interface Incident {
  _links: {
    curies: { href: string; name: string }
    self: { href: string }
    archives: { href: string }
    'sia:children'?: { href: string }[]
    'sia:parent'?: { href: string }
    'sia:attachments': { href: string }
    'sia:pdf': { href: string }
    'sia:context': { href: string }
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
    geometrie: Geometrie
    extra_properties: Record<string, unknown> | null
    created_by?: string | null
    bag_validated?: boolean
  } | null
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
  } | null
  reporter: {
    email: string | null
    phone: string | null
    sharing_allowed: boolean
    allows_contact: boolean
  } | null
  priority: {
    priority: Priority
    created_by: string | null
  } | null
  notes: {
    created_by: string | null
    text: string
  }[]
  type: {
    code: TypeCode
    created_at: string
    created_by: string | null
  } | null
  source: string
  text: string
  text_extra: string | null
  extra_properties?: unknown | null
  created_at: string
  updated_at: string
  incident_date_start?: string | null
  incident_date_end?: string | null
  attachments: string[]
  assigned_user_email: string | null
  routing_departments: Department[] | null
}
