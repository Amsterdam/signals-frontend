// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { MouseEvent } from 'react'
import type { IconOptions } from 'leaflet'
import type { Point, Feature as GeoJSONFeature } from 'geojson'

export type ClickEventHandler = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
) => void

export interface BaseItem {
  id: string
  type: string
  description?: string
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

export interface WfsFilter {
  value: string
}

export interface DataLayerProps {
  featureTypes: FeatureType[]
  desktopView?: boolean
  allowClusters?: boolean
  reportedLayer?: boolean
}

export type FeatureProps = Record<string, string | number | undefined>
export type Feature = GeoJSONFeature<Point, FeatureProps>
