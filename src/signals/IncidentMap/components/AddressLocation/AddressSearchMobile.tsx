// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useState } from 'react'

import { ChevronLeft } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import type { PdokResponse } from 'shared/services/map-location'

import {
  AddressSearchWrapper as Wrapper,
  StyledPDOKAutoSuggest,
  AddressSearch,
  OptionsList,
} from './styled'

export interface Props {
  address?: string
  setCoordinates: (coordinates?: LatLngLiteral) => void
  setShowAddressSearchMobile: (value: boolean) => void
}

export const AddressSearchMobile = ({
  address,
  setCoordinates,
  setShowAddressSearchMobile,
}: Props) => {
  const [optionsList, setOptionsList] = useState(null)

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)
      setShowAddressSearchMobile(false)
    },
    [setCoordinates, setShowAddressSearchMobile]
  )

  return (
    <Wrapper>
      <AddressSearch id="addressSearchMobile">
        <header>
          <Button
            aria-label="Terug"
            aria-controls="addressSearchMobile"
            icon={<ChevronLeft />}
            iconSize={16}
            onClick={() => setShowAddressSearchMobile(false)}
            size={24}
            title="Terug"
            variant="blank"
          />
          <StyledPDOKAutoSuggest
            aria-label="searchAddressBarMob"
            aria-required="false"
            onClear={() => setCoordinates(undefined)}
            onData={setOptionsList}
            onSelect={onAddressSelect}
            showInlineList={false}
            value={address}
            placeholder="Zoom naar adres"
            autoFocus
          />
        </header>

        {optionsList && (
          <OptionsList data-testid="optionsList">{optionsList}</OptionsList>
        )}
      </AddressSearch>
    </Wrapper>
  )
}
