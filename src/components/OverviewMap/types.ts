// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam

import type { StatusCode } from 'types/status-code'

export interface IncidentSummary {
  id: string | number
  created_at?: string
  status?: StatusCode
  category?: {
    main?: string
    sub?: string
  }
}
