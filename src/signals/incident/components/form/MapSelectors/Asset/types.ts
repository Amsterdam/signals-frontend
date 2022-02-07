// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FC } from 'react'
import type { LatLngLiteral } from 'leaflet'
import type { Location } from 'types/incident'
import type { Address } from 'types/address'
import type { FormOptions } from 'types/reactive-form'
import type { EventHandler, Meta, Item } from '../types'
import type { FormFieldProps } from '../../FormField/FormField'

export interface AssetSelectValue {
  address?: Address
  close: () => void
  edit: EventHandler
  layer?: FC
  coordinates?: LatLngLiteral
  message?: string
  meta: Meta
  removeItem: () => void
  selection?: Item
  setItem: (item: Item) => void
  fetchLocation: (latLng: LatLngLiteral) => void
  setLocation: (location: Location) => void
  setMessage: (message?: string) => void
  setNotOnMap: (itemNotPresentOnMap?: boolean) => void
}

export interface AssetSelectRendererProps extends FormFieldProps {
  meta: Meta
  handler: any
  parent: any
  validatorsOrOpts: FormOptions
}
