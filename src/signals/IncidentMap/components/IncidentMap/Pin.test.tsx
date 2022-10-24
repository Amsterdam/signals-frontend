// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import type { Map } from 'leaflet'

import { DEFAULT_ZOOM } from '../../../../components/AreaMap/AreaMap'
import type { Props } from './Pin'
import { Pin } from './Pin'

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('@amsterdam/react-maps')!,
  Marker: ({ ...props }) => {
    return <div {...props}></div>
  },
}))

const mockMap = {
  flyTo: jest.fn(),
} as unknown as Map

const coords = {
  lat: 52.3731081,
  lng: 4.8932945,
}

const defaultProps: Props = {
  map: mockMap,
  coordinates: coords,
}

describe('Pin', () => {
  it('renders a pin', () => {
    render(<Pin {...defaultProps} />)

    expect(screen.getByTestId('incidentPinMarker')).toBeInTheDocument()
  })

  it('flies to the location', () => {
    render(<Pin {...defaultProps} />)

    expect(defaultProps.map.flyTo).toHaveBeenCalledWith(
      { lat: coords.lat, lng: coords.lng },
      DEFAULT_ZOOM
    )
  })
})
