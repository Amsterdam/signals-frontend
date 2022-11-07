// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import type { PdokResponse } from 'shared/services/map-location'

import {
  StyledPDOKAutoSuggest,
  AddressLocationWrapper as Wrapper,
  Label,
} from './styled'
export interface Props {
  address?: string
  setCoordinates: (coordinates?: LatLngLiteral) => void
  setShowAddressSearchMobile: (value: boolean) => void
}

export const AddressLocation = ({
  setCoordinates,
  address,
  setShowAddressSearchMobile,
}: Props) => {
  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)
    },
    [setCoordinates]
  )

  return (
    <Wrapper>
      <Heading as="h4">Zoom naar adres</Heading>
      <Label htmlFor="searchAddressBar">searchAddressBar</Label>
      <StyledPDOKAutoSuggest
        data-testid="searchAddressBar"
        aria-label="searchAddressBar"
        aria-required="false"
        placeholder="Adres"
        onSelect={onAddressSelect}
        value={address}
        onClear={() => setCoordinates(undefined)}
        onFocus={() => {
          setShowAddressSearchMobile(true)
        }}
      />
    </Wrapper>
  )
}
