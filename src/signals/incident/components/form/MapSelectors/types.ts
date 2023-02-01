// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import type { MouseEvent, KeyboardEvent } from 'react'

import type { Point, Feature as GeoJSONFeature } from 'geojson'
import type { IconOptions, LatLngLiteral } from 'leaflet'

import type { Address } from 'types/address'

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

export enum FeatureStatus {
  CHECKED = 'checked',
  REPORTED = 'reported',
}

export interface Item extends Record<string, unknown> {
  description?: string
  id?: string | number
  status?: typeof FeatureStatus | string
  type?: typeof UNREGISTERED_TYPE | typeof UNKNOWN_TYPE | string
  label?: string
  coordinates?: LatLngLiteral
  address?: Address
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
  maxNumberOfAssets?: number
  language?: Record<string, string>
  wfsFilter?: string
  extraProperties?: string[]
  ifAllOf?: { subcategory: string }
  label?: string
  shortLabel?: string
  pathMerge?: string
}

export type FeatureProps = Record<string, string | number | undefined | null>
export type Feature = GeoJSONFeature<Point, FeatureProps>
