// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { Feature, Point, FeatureCollection } from 'geojson'
import { StatusCode } from 'signals/incident-management/definitions/statusList'

export type Property = {
  id: number
  created_at: string
  status: {
    state: StatusCode
    state_display: string
  }
}

export type AreaFeature = Feature<Point, Property>
export type AreaFeatureCollection = FeatureCollection<Point, Property>
