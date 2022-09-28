// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useCallback } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import { formatAddress } from '../../../../shared/services/format-address'
import type { PdokResponse } from '../../../../shared/services/map-location'
import type { Address } from '../../../../types/address'
import { StyledPDOKAutoSuggest } from '../../../incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled'

export interface Props {
  setCoordinates: (coordinates: LatLngLiteral) => void
  address?: Address
  setAddress: (address?: Address) => void
}

export const AddressLocation = ({ setCoordinates, address }: Props) => {
  const addressValue = address ? formatAddress(address) : ''

  const onAddressSelect = useCallback(
    async (option: PdokResponse) => {
      const { location } = option.data
      setCoordinates(location)
    },
    [setCoordinates]
  )

  return (
    <>
      <Paragraph strong gutterBottom={16}>
        Zoom naar adres of postcode
      </Paragraph>

      <StyledPDOKAutoSuggest
        data-testid="searchAddressBar"
        placeholder={'Zoek adres of postcode'}
        onSelect={onAddressSelect}
        value={addressValue}
      />
    </>
  )
}
