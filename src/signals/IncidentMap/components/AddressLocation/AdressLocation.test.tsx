// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'

import { formatAddress } from '../../../../shared/services/format-address'
import type { Props } from './AddressLocation'
import { AddressLocation } from './AddressLocation'

const coords = {
  lat: 52.3731081,
  lng: 4.8932945,
}

const mockPdokAddress = {
  huisnummer: '178',
  openbare_ruimte: 'Warmoesstraat',
  postcode: '1012JK',
  woonplaats: 'Amsterdam',
}

const mockPdokResponse = {
  id: 1,
  value: 'mockValue',
  data: {
    location: coords,
    address: mockPdokAddress,
  },
}

jest.mock(
  'signals/incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled',
  () => ({
    ...jest.requireActual(
      'signals/incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled'
    ),
    StyledPDOKAutoSuggest: ({ onSelect, value, ...rest }: any) => {
      onSelect(mockPdokResponse)
      return <div {...rest}>{value}</div>
    },
  })
)

const defaultProps: Props = {
  setCoordinates: jest.fn(),
  address: mockPdokAddress,
  setAddress: jest.fn(),
}

describe('AddresLocation', () => {
  it('tests whether the onAddressSelect actually sets the coordinates', async () => {
    render(<AddressLocation {...defaultProps} />)

    //the mocked PDOKAutoSuggest triggers automatically onSelect/onAddressSelect, no userEvents are necessary
    expect(defaultProps.setCoordinates).toHaveBeenCalledWith(coords)
  })

  it('shows the address in the searchbar', () => {
    render(<AddressLocation {...defaultProps} />)

    expect(screen.getByTestId('searchAddressBar').innerHTML).toEqual(
      formatAddress(mockPdokAddress)
    )
  })
})
