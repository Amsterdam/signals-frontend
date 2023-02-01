// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { Point, FeatureCollection } from 'geojson'

import type { StatusCode } from 'signals/incident-management/definitions/types'

export type Property = {
  id: number
  created_at: string
  status: {
    state: StatusCode
    state_display: string
  }
}

export type Geography = FeatureCollection<Point, Property>
