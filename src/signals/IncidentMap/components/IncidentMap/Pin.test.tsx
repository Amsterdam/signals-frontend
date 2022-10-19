// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import type { Map } from 'leaflet'

import { DEFAULT_ZOOM } from '../../../../components/AreaMap/AreaMap'
import { DeviceMode } from '../DrawerOverlay/types'
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
  mode: DeviceMode.Desktop,
  closeOverlay: jest.fn(),
}

describe('Pin', () => {
  it('should renders a pin', () => {
    render(<Pin {...defaultProps} />)

    expect(screen.getByTestId('incidentPinMarker')).toBeInTheDocument()
  })

  it('should fly to the location', () => {
    render(<Pin {...defaultProps} />)

    expect(defaultProps.map.flyTo).toHaveBeenCalledWith(
      { lat: coords.lat, lng: coords.lng },
      DEFAULT_ZOOM
    )
    expect(defaultProps.closeOverlay).not.toHaveBeenCalled()
  })

  it('should close drawerOverlay when on mobile', () => {
    const props = {
      ...defaultProps,
      mode: DeviceMode.Mobile,
    }
    render(<Pin {...props} />)

    expect(defaultProps.closeOverlay).toHaveBeenCalled()
  })
})
