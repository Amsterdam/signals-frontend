// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { IconOptions, LatLngExpression } from 'leaflet'
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
  wfsFilter?: string
}

export interface AssetSelectValue {
  selection: Item[]
  location: LatLngExpression
  meta: Meta
  message?: string
  update: (items: Item[]) => void
  edit: ClickEventHandler
  close: () => void
  setMessage: (message?: string) => void
}
