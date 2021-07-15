import type { FetchError } from 'hooks/useFetch'
import { AnyAction } from 'redux'
import { StatusCode } from 'signals/incident-management/definitions/statusList'
import type { Incident } from 'types/api/incident'
import type ContextType from 'types/context'

export interface Context {
  incident?: Incident
  update?: (action: AnyAction) => void
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

export interface IncidentChild {
  _links: { self: { href: string } }
  id: number
  status: {
    state: StatusCode
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
