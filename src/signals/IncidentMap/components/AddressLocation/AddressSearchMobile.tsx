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

interface Props {
  address?: string
  setCoordinates: (coordinates?: LatLngLiteral) => void
  setShowAddressPanel: (value: boolean) => void
}

export const AddressSearchMobile = ({
  address,
  setCoordinates,
  setShowAddressPanel,
}: Props) => {
  const [optionsList, setOptionsList] = useState(null)

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)
      setShowAddressPanel(false)
    },
    [setCoordinates, setShowAddressPanel]
  )

  const closeAddressPanel = useCallback(() => {
    setShowAddressPanel(false)
  }, [setShowAddressPanel])

  return (
    <Wrapper>
      <AddressSearch id="AddressSearchMobile">
        <header>
          <Button
            aria-label="Terug"
            aria-controls="AddressSearchMobile"
            icon={<ChevronLeft />}
            iconSize={16}
            onClick={closeAddressPanel}
            size={24}
            title="Terug"
            variant="blank"
          />
          <StyledPDOKAutoSuggest
            onClear={() => setCoordinates(undefined)}
            onData={setOptionsList}
            onSelect={onAddressSelect}
            showInlineList={false}
            value={address}
            placeholder="Zoom naar adres"
            autoFocus={true}
          />
        </header>

        {optionsList && (
          <OptionsList data-testid="optionsList">{optionsList}</OptionsList>
        )}
      </AddressSearch>
    </Wrapper>
  )
}
