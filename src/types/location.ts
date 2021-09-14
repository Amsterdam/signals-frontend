// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { Address } from './address'
export default interface Location {
  address?: Address
  address_text?: string
  buurt_code?: string
  id?: number
  bag_validated?: boolean
  stadsdeel?: string
  geometrie?: {
    coordinates?: [number, number]
  }
}
