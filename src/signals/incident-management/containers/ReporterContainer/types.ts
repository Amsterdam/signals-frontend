// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { Incident as IncidentType } from '../IncidentDetail/types'
export interface Feedback {
  isSatisfied: boolean | null
  submittedAt: string | null
}

export interface Incident {
  isLoading: boolean
  data?: IncidentType
  id?: number
  canView?: boolean
}

export interface ReporterIncident {
  id: number
  canView: boolean
  category: string
  feedback: Feedback | null
  status: string
  createdAt: string
  hasChildren: boolean
}

export interface Incidents {
  isLoading: boolean
  data?: {
    count: number
    list: ReporterIncident[]
  }
}
