// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import type { Address } from 'types/address'

import {DeviceMode} from "../../types/device-mode";
import {DrawerState} from "../DrawerOverlay";
import { getDeviceMode} from "../utils/get-device-mode";
import { StyledPDOKAutoSuggest, Wrapper } from './styled'


export interface Props {
  setCoordinates: (coordinates: LatLngLiteral) => void
  address?: Address
  setDrawerState: (drawerState: DrawerState) => void
}

export const AddressLocation = ({ setCoordinates, address, setDrawerState }: Props) => {
  const addressValue = address ? formatAddress(address) : ''

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)
      if(getDeviceMode(window.innerWidth) === DeviceMode.Mobile) {setDrawerState(DrawerState.Closed)}
    },
    [setCoordinates, setDrawerState]
  )

  return (
    <Wrapper>
      <Heading as="h4">Zoom naar adres</Heading>
      <StyledPDOKAutoSuggest
        data-testid="searchAddressBar"
        placeholder={'Zoek naar adres'}
        onSelect={onAddressSelect}
        value={addressValue}
      />
    </Wrapper>
  )
}
