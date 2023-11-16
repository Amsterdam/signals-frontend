// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useCallback, useState } from 'react'

import type { LatLngLiteral } from 'leaflet'

import PDOKAutoSuggest from 'components/PDOKAutoSuggest'
import type { PdokResponse } from 'shared/services/map-location'

import { AddressSearchWrapper as Wrapper, OptionsList } from './styled'

export interface Props {
  address?: string
  setCoordinates: (coordinates?: LatLngLiteral) => void
  onFocus: () => void
}

export const AddressSearchMobile = ({
  address,
  setCoordinates,

  onFocus,
}: Props) => {
  const [optionsList, setOptionsList] = useState<boolean | null>(null)

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      setCoordinates(option.data.location)

      setOptionsList(false)
    },
    [setCoordinates]
  )

  const onClear = useCallback(() => {
    setCoordinates(undefined)
    setOptionsList(false)
  }, [setCoordinates])

  return (
    <Wrapper>
      <PDOKAutoSuggest
        data-testid="search-address-bar-mobile"
        aria-label="veld zoek naar adres"
        onClear={onClear}
        onData={setOptionsList}
        onSelect={onAddressSelect}
        showInlineList={false}
        value={address}
        placeholder="Zoek naar adres of postcode"
        autoFocus
        onFocus={onFocus}
      />

      {optionsList && (
        <OptionsList data-testid="optionsList">{optionsList}</OptionsList>
      )}
    </Wrapper>
  )
}
