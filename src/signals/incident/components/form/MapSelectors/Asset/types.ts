// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import type { FC } from 'react'
import type { LatLngLiteral } from 'leaflet'
import type { Location } from 'types/incident'
import type { Address } from 'types/address'
import type { FormOptions } from 'types/reactive-form'
import type { Meta, Item, FeatureType } from '../types'
import type { FormFieldProps } from '../../FormField/FormField'

export interface AssetSelectValue {
  address?: Address
  layer?: FC
  coordinates?: LatLngLiteral
  message?: string
  meta: Meta
  removeItem: (item: Item) => void
  removeAllItems: () => void
  selection?: Item[]
  setItem: (item: Item, location?: Location) => void
  fetchLocation: (latLng: LatLngLiteral) => void
  setLocation: (location: Location) => void
  setMessage: (message?: string) => void
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
