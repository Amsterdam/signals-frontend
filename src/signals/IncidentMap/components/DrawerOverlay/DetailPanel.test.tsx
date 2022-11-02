// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { mockIncidentsLong } from '../__test__'
import type { Props } from './DetailPanel'
import { DetailPanel } from './DetailPanel'

jest.mock('./utils', () => ({
  __esModule: true,
  ...jest.requireActual('./utils'),
  getAddress: (_geometry: any, setAddress: (address: any) => void) =>
    setAddress({
      postcode: '1000 AA',
      huisnummer: '100',
      woonplaats: 'Amsterdam',
      openbare_ruimte: 'Damstraat',
    }),
}))

const defaultProps: Props = {
  onClose: jest.fn(),
  incident: mockIncidentsLong[0],
}

const renderComponent = (props?: Props) =>
  render(<DetailPanel {...defaultProps} {...props} />)

describe('DetailPanel', () => {
  it('should render detail panel', () => {
    renderComponent()

    expect(
      screen.getByText(
        'Restafval container is kapot of vol. Of er is iets anders aan de hand. In elk geval er kan niks meer in de container.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('7 september 2022')).toBeInTheDocument()
    expect(screen.getByText(/Damstraat 100/)).toBeInTheDocument()
    expect(screen.getByText(/1000 AA Amsterdam/)).toBeInTheDocument()
  })
})
