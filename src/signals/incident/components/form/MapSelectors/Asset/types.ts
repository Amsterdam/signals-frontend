// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FC } from 'react'
import type { IconOptions, LatLngTuple, LatLngLiteral } from 'leaflet'
import type { Feature as GeoJSONFeature, Point } from 'geojson'
import type { ClickEventHandler } from '../types'
import type { Icon } from '../Caterpillar/types'

export interface Item {
  id: string | number
  type: string
  description?: string
  isReported?: boolean
  [key: string]: unknown
}

export interface FeatureType {
  label: string
  description: string
  icon: FeatureIcon
  iconId?: string
  iconIsReportedId?: string
  idField: string
  isReportedField?: string
  isReportedValue?: number
  typeField: string
  typeValue: string
}

export interface FeatureIcon {
  options?: Partial<IconOptions>
  iconSvg: string
  selectedIconSvg?: string
  reportedIconSvg?: string
}

export interface Options {
  className: string
  iconSize: number[]
}

export interface Meta extends Record<string, unknown> {
  name?: string
  endpoint: string
  featureTypes: FeatureType[]
  language?: Record<string, string>
  wfsFilter?: string
  icons?: Icon[]
  extraProperties?: string[]
  ifAllOf?: { subcategory: string }
  label?: string
  shortLabel?: string
  pathMerge?: string
}

export interface AssetSelectValue {
  close: () => void
  edit: ClickEventHandler
  layer?: FC
  location?: LatLngTuple
  message?: string
  meta: Meta
  selection: Item[]
  setLocation: (latLng: LatLngLiteral) => void
  setMessage: (message?: string) => void
  update: (items: Item[]) => void
}

export interface DataLayerProps {
  featureTypes: FeatureType[]
  desktopView?: boolean
  allowClusters?: boolean
  reportedLayer?: boolean
}

export type FeatureProps = Record<string, string | number | undefined>
export type Feature = GeoJSONFeature<Point, FeatureProps>
