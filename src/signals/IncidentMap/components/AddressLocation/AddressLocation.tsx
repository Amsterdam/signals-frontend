// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import type { Address } from 'types/address'

import { StyledPDOKAutoSuggest, Wrapper } from './styled'
export interface Props {
  address?: Address
  setCoordinates: (coordinates?: LatLngLiteral) => void
}

export const AddressLocation = ({ setCoordinates, address }: Props) => {
  const addressValue = address ? formatAddress(address) : ''

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)
    },
    [setCoordinates]
  )

  return (
    <Wrapper>
      <Heading as="h4">Zoom naar adres</Heading>
      <StyledPDOKAutoSuggest
        data-testid="searchAddressBar"
        placeholder={'Zoek naar adres'}
        onSelect={onAddressSelect}
        value={addressValue}
        onClear={() => setCoordinates(undefined)}
      />
    </Wrapper>
  )
}
