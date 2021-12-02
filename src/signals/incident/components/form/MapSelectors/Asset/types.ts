// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { IconOptions, LatLngExpression } from 'leaflet'
import type { FC } from 'react'
import { ClickEventHandler } from '../types'
import { Icon } from '../Caterpillar/types'

export interface Item {
  id: string | number
  type: string
  description?: string
  isReported?: boolean
}

export interface FeatureType {
  label: string
  description: string
  icon: FeatureIcon
  iconId?: string
  iconIsReportedId?: string
  idField: string
  isReportedField?: string
  isReportedValue?: string
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
  legendItems?: { id: string; label: string; iconId: string }[]
  icons?: Icon[]
  extraProperties?: string[]
}

export interface AssetSelectValue {
  selection: Item[]
  layer?: FC
  location: LatLngExpression
  meta: Meta
  message?: string
  update: (items: Item[]) => void
  edit: ClickEventHandler
  close: () => void
  setMessage: (message?: string) => void
}
