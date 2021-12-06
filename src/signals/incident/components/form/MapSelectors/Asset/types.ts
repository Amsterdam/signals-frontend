// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { IconOptions, LatLngTuple, LatLngLiteral } from 'leaflet'
import { ClickEventHandler } from '../types'

export interface Item {
  id: string
  type: string
  description?: string
}

export interface FeatureType {
  label: string
  description: string
  icon: FeatureIcon
  idField: string
  typeField: string
  typeValue: string
}

export interface FeatureIcon {
  options?: Partial<IconOptions>
  iconSvg: string
  selectedIconSvg?: string
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
}

export interface AssetSelectValue {
  close: () => void
  edit: ClickEventHandler
  location?: LatLngTuple
  message?: string
  meta: Meta
  selection: Item[]
  setLocation: (latLng: LatLngLiteral) => void
  setMessage: (message?: string) => void
  update: (items: Item[]) => void
}
