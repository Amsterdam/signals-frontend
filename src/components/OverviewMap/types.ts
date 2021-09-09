// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { StatusCode } from 'signals/incident-management/definitions/types'

export interface IncidentSummary {
  id: string | number
  created_at?: string
  status?: StatusCode
  category?: {
    main?: string
    sub?: string
  }
}
