import type { AnyAction } from 'redux'

import type { FetchError } from 'hooks/useFetch'
import type { DefaultTexts } from 'types/api/default-text'
import type { Incident } from 'types/api/incident'
import type ContextType from 'types/context'
import type { StatusCode } from 'types/status-code'

export interface Context {
  incident?: Incident
  update: (action: AnyAction) => void
  preview?: (section: string, payload?: Partial<State>) => void
  edit?: (section: string, payload?: Partial<State>) => void
  close?: () => void
  getIncident?: (url: string) => void
  getHistory?: (url: string) => void
  toggleExternal?: () => void
  attachments?: Result<Attachment>
}

export interface State {
  incident?: Incident
  attachments?: Result<Attachment>
  children?: Result<IncidentChild>
  childrenHistory?: HistoryEntry[][]
  childIncidents?: Incident[]
  defaultTexts?: DefaultTexts
  history?: HistoryEntry[]
  context?: ContextType
  error?: boolean | FetchError
  attachmentHref?: string
  patching?: string
  edit?: string
  preview?: string
  external?: boolean
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
  updated_at: string
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
  _display: string
  created_at: string
  created_by: string | null
  is_image: boolean
  location: string
  caption: string | null
  public: boolean
  _links: {
    self: {
      href: string
    }
  }
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

export type EmailTemplate = {
  subject?: string
  html?: string
}

export type SignalReporter = {
  id: string
  email: string
  phone: string
  allows_contact: boolean
  sharing_allowed: boolean
  state: string
  email_verification_token_expires: string
  created_at: string
  updated_at: string
}
