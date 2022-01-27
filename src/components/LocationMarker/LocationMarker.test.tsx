// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import Leaflet from 'leaflet'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'

import MAP_OPTIONS from 'shared/services/configuration/map-options'

import Map from '../Map'
import LocationMarker from './index'

jest.mock('leaflet', () => jest.requireActual('leaflet'))

Leaflet.Circle.prototype.addTo = jest.fn()
Leaflet.Circle.prototype.setLatLng = jest.fn()
Leaflet.Circle.prototype.setRadius = jest.fn()
Leaflet.Circle.prototype.remove = jest.fn()

Leaflet.CircleMarker.prototype.addTo = jest.fn()
Leaflet.CircleMarker.prototype.setLatLng = jest.fn()
Leaflet.CircleMarker.prototype.remove = jest.fn()

describe('components/LocationMarker', () => {
  it('creates vector layers', () => {
    const accuracy = 1234
    const latitude = 52
    const longitude = 4
    const geolocation = {
      accuracy,
      latitude,
      longitude,
    }

    const coords = {
      accuracy: 50,
      latitude: 52.3731081,
      longitude: 4.8932945,
    }
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        Promise.resolve(
          success({
            coords,
          })
        )
      ),
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })

    expect(Leaflet.Circle.prototype.addTo).not.toHaveBeenCalled()
    expect(Leaflet.Circle.prototype.setLatLng).not.toHaveBeenCalled()
    expect(Leaflet.Circle.prototype.setRadius).not.toHaveBeenCalled()

    expect(Leaflet.CircleMarker.prototype.addTo).not.toHaveBeenCalled()
    expect(Leaflet.CircleMarker.prototype.setLatLng).not.toHaveBeenCalled()

    const { unmount } = render(
      withAppContext(
        <Map mapOptions={MAP_OPTIONS} hasGPSControl>
          <LocationMarker geolocation={geolocation} />
        </Map>
      )
    )

    expect(Leaflet.Circle.prototype.addTo).toHaveBeenCalled()
    expect(Leaflet.Circle.prototype.setLatLng).toHaveBeenCalledWith([
      latitude,
      longitude,
    ])
    expect(Leaflet.Circle.prototype.setRadius).toHaveBeenCalledWith(accuracy)

    userEvent.click(screen.queryByTestId('gpsButton'))

    expect(Leaflet.CircleMarker.prototype.addTo).toHaveBeenCalled()
    expect(Leaflet.CircleMarker.prototype.setLatLng).toHaveBeenCalledWith([
      latitude,
      longitude,
    ])

    expect(Leaflet.Circle.prototype.remove).not.toHaveBeenCalled()

    unmount()

    expect(Leaflet.Circle.prototype.remove).toHaveBeenCalled()
    expect(Leaflet.CircleMarker.prototype.remove).toHaveBeenCalled()
  })
})
