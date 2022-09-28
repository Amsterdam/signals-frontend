import { render, screen } from '@testing-library/react'

import { mockIncidents } from '../__test__'
import type { Props } from './DetailPanel'
import { DetailPanel } from './DetailPanel'
import type { DisplayAddress } from './types'

jest.mock('./utils', () => ({
  __esModule: true,
  ...jest.requireActual('./utils'),
  getAddress: (
    _geometry: any,
    setAddress: (incident: DisplayAddress) => void
  ) => setAddress({ streetName: 'Dam 10', postalCode: '1234AA Amsterdam' }),
}))

const defaultProps: Props = {
  onClose: jest.fn(),
  incident: mockIncidents[0],
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
    expect(screen.getByText('07-09-2022 12:09')).toBeInTheDocument()
    expect(screen.getByText('Dam 10')).toBeInTheDocument()
    expect(screen.getByText('1234AA Amsterdam')).toBeInTheDocument()
  })
})
