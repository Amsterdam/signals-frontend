// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam

export interface Feedback {
  isSatisfied: boolean | null
  submittedAt: string | null
}

export interface Incident {
  isLoading: boolean
  data?: {
    email?: string | null
    id: number
    text: string | null
  }
}

export interface ReporterIncident {
  id: number
  category: string
  feedback: Feedback | null
  status: string
  createdAt: string
  hasChildren: boolean
}

export interface Incident {
  id: number
  created_at: string
  category: {
    sub: string
    sub_slug: string
  }
  status: {
    state: string
    state_display: string
  }
  reporter: {
    email: string
  }
  text: string
  _links: Record<string, string>
}
export interface Incidents {
  isLoading: boolean
  data?: {
    count: number
    list: ReporterIncident[]
  }
}
