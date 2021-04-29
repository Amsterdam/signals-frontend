import type { FetchError } from 'hooks/useFetch'
import type ContextType from 'types/context'

export interface Context {
  incident?: Incident
  update?: (action: string) => void
  preview?: (section: string, payload?: Partial<State>) => void
  edit?: (section: string, payload?: Partial<State>) => void
  close?: () => void
}

export interface State {
  incident?: Incident
  attachments?: Result<Attachment>
  children?: Result<IncidentChild>
  childrenHistory?: HistoryEntry[][]
  childIncidents?: Incident[]
  history?: HistoryEntry[]
  context?: ContextType
  error?: boolean | FetchError
  attachmentHref?: string
  patching?: string
  edit?: string
  preview?: string
}

interface Address {
  postcode: string
  huisletter: string | null
  huisnummer: string
  woonplaats: string
  openbare_ruimte: string
  huisnummer_toevoeging: string
}

type Coordinates = [number, number]

export interface Incident {
  _links: {
    curies: { href: string; name: string }
    _link: { self: { href: string } }
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
  }
  id: number
  has_attachments: boolean
  location: {
    stadsdeel: string
    buurt_code: string
    address: Address
    geometrie: {
      type: string
      coordinates: Coordinates
    }
    extra_properties: Record<string, unknown>
  }
  status: {
    text: string | null
    state: string
    state_display: string
    target_api: string | null
    created_by: string | null
    created_at: string
    extra_properties: Record<string, unknown>
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
  type: {
    code: 'SIG' | 'REQ' | 'QUE' | 'COM' | 'MAI'
    created_at: string
    created_by: string | null
  }
  source: string
  text: string
  text_extra: string | null
  created_at: string
  updated_at: string
  attachments: string[]
  assigned_user_email: string | null
  routing_departments: Department[]
}

export interface IncidentChild {
  _links: { self: { href: string } }
  id: number
  status: {
    state: string
    state_display: string
  }
  category: {
    sub: string
    sub_slug: string
    departments: string
    main: string
    main_slug: string
  }
  can_view_signal: boolean
}

export interface HistoryEntry {
  identifier: string
  when: string
  what: string
  action: string
  description: string | null
  who: string
}

export interface Attachment {
  location: string
  is_image: boolean
  created_at: string
}

export interface Result<T> {
  count: number
  results: T[]
}

export interface User {
  _display: string
  id: number
  username: string
  is_active: boolean
  roles: string[]
  profile: {
    note: string
    departments: string[]
    created_at: string
    updated_at: string
  }
}

export interface Department {
  _display: string
  id: number
  name: string
  code: string
  is_intern: boolean
  can_direct: true
  category_names: string[]
}
