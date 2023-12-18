// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import type { LatLngLiteral } from 'leaflet'

import type { FormFieldProps } from 'components/FormField/FormField'
import type { Address } from 'types/address'
import type { Location } from 'types/incident'
import type { FormOptions } from 'types/reactive-form'

import type { SelectableFeature, Meta, Item, FeatureType } from '../types'
export interface AssetSelectValue {
  address?: Address
  coordinates?: LatLngLiteral
  fetchLocation: (latLng: LatLngLiteral) => void
  layer?: FC
  message?: string
  meta: Meta
  removeItem: (item?: Item) => void
  selectableFeatures?: SelectableFeature[]
  selection?: Item[]
  setItem: (item: Item, location?: Location) => void
  setLocation: (location: Location) => void
  setMessage: (message?: string) => void
  setSelectableFeatures: (features?: SelectableFeature[]) => void
}

export interface AssetSelectRendererProps extends FormFieldProps {
  meta: Meta
  handler: any
  parent: any
  validatorsOrOpts: FormOptions
}

export interface SummaryProps {
  address?: Address
  coordinates?: LatLngLiteral
  selection?: Item[]
  featureTypes: FeatureType[]
}
