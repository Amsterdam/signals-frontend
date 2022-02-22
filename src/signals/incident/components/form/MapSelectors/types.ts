// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { MouseEvent, KeyboardEvent } from 'react'
import type { IconOptions } from 'leaflet'
import type { Point, Feature as GeoJSONFeature } from 'geojson'
import type { UNKNOWN_TYPE, UNREGISTERED_TYPE } from './constants'

export type EventHandler = (
  event:
    | MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    | KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>
) => void

export interface BaseItem {
  id: string
  type: string
  description?: string
}

export interface Item extends Record<string, unknown> {
  description?: string
  id?: string | number
  status?: string
  type?: typeof UNREGISTERED_TYPE | typeof UNKNOWN_TYPE | string
  label?: string
}

export interface FeatureType {
  label: string
  description: string
  icon: FeatureIcon
  idField: string
  typeField: string
  typeValue: string
}

export interface FeatureStatusType extends FeatureType {
  statusField: string
  statusValues: string[] | number[]
}

export interface ReportedFeatureType extends FeatureType {
  isReportedField: string
  isReportedValue: number
}

export interface CheckedFeatureType extends FeatureType {
  isCheckedField: string
  isCheckedValues: string[]
}

export interface FeatureIcon {
  options?: Partial<IconOptions>
  iconUrl: string
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
  featureStatusTypes?: FeatureStatusType[]
  desktopView?: boolean
}

export interface Meta extends Record<string, unknown> {
  name?: string
  endpoint: string
  featureTypes: FeatureType[]
  featureStatusTypes?: FeatureStatusType[]
  language?: Record<string, string>
  wfsFilter?: string
  extraProperties?: string[]
  ifAllOf?: { subcategory: string }
  label?: string
  shortLabel?: string
  pathMerge?: string
}

export type FeatureProps = Record<string, string | number | undefined>
export type Feature = GeoJSONFeature<Point, FeatureProps>
