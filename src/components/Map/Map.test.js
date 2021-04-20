// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, act, fireEvent, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import { withAppContext } from 'test/utils'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_NOTICE } from 'containers/Notification/constants'
import configuration from 'shared/services/configuration/configuration'
import Map from './Map'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

describe('components/Map', () => {
  beforeEach(() => {
    dispatch.mockReset()
  })

  it('should render the map', () => {
    const { getByTestId, getByText } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} />)
    )

    // Map
    expect(getByTestId('map-base')).toBeInTheDocument()

    // Tile layer
    expect(getByText(/Kaartgegevens . Kadaster/)).toBeInTheDocument()
  })

  it('should call setInstance', () => {
    const setInstance = jest.fn()

    expect(setInstance).not.toHaveBeenCalled()

    render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} setInstance={setInstance} />)
    )

    expect(setInstance).toHaveBeenCalled()
  })

  it('should render the zoom control', () => {
    const { container, rerender, unmount } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} />)
    )

    expect(
      container.querySelector('button[title="Inzoomen"]')
    ).not.toBeInTheDocument()

    unmount()

    rerender(withAppContext(<Map mapOptions={MAP_OPTIONS} hasZoomControls />))
    expect(
      container.querySelector('button[title="Inzoomen"]')
    ).toBeInTheDocument()
  })

  it('should render a gps button', () => {
    const { getByTestId, queryByTestId, unmount, rerender } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} />)
    )

    expect(queryByTestId('gpsButton')).not.toBeInTheDocument()

    unmount()
    rerender(withAppContext(<Map mapOptions={MAP_OPTIONS} hasGPSControl />))

    expect(getByTestId('gpsButton')).toBeInTheDocument()
  })

  it('should NOT render the gps button when the functions is not present', () => {
    const geolocation = global.navigator.geolocation
    global.navigator.geolocation = undefined
    render(withAppContext(<Map mapOptions={MAP_OPTIONS} hasGPSControl />))

    expect(screen.queryByTestId('gpsButton')).not.toBeInTheDocument()
    global.navigator.geolocation = geolocation
  })

  it('should render a location marker', () => {
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

    global.navigator.geolocation = mockGeolocation

    const { getByTestId, queryByTestId } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} hasGPSControl />)
    )

    expect(queryByTestId('locationMarker')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(getByTestId('locationMarker')).toBeInTheDocument()
  })

  it('should show a notification whenever the location cannot be retrieved', () => {
    const code = 1
    const message = 'User denied geolocation'
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) =>
        Promise.resolve(
          error({
            code,
            message,
          })
        )
      ),
    }

    global.navigator.geolocation = mockGeolocation

    const { getByTestId } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} hasGPSControl />)
    )

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(
        expect.objectContaining({
          title: `${configuration.language.siteAddress} heeft geen toestemming om uw locatie te gebruiken.`,
          type: TYPE_LOCAL,
          variant: VARIANT_NOTICE,
        })
      )
    )
  })

  it('should show a notification whenever the location is out of bounds', () => {
    const coords = {
      accuracy: 50,
      latitude: 55.3731081,
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

    global.navigator.geolocation = mockGeolocation

    const { getByTestId } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} hasGPSControl />)
    )

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(
        expect.objectContaining({
          title: 'Uw locatie valt buiten de kaart en is daardoor niet te zien',
          type: TYPE_LOCAL,
          variant: VARIANT_NOTICE,
        })
      )
    )
  })

  it('should fall back to configuration settings', () => {
    const { getByTestId, rerender, unmount } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} />)
    )

    const maxZoom = Number.parseInt(getByTestId('map-base').dataset.maxZoom, 10)
    const minZoom = Number.parseInt(getByTestId('map-base').dataset.minZoom, 10)

    expect(maxZoom).toEqual(MAP_OPTIONS.maxZoom)
    expect(minZoom).toEqual(MAP_OPTIONS.minZoom)

    unmount()

    rerender(
      withAppContext(
        <Map
          mapOptions={{
            ...MAP_OPTIONS,
            maxZoom: undefined,
            minZoom: undefined,
          }}
        />
      )
    )

    const maxZoomFromConfig = Number.parseInt(
      getByTestId('map-base').dataset.maxZoom,
      10
    )
    const minZoomFromConfig = Number.parseInt(
      getByTestId('map-base').dataset.minZoom,
      10
    )

    expect(maxZoomFromConfig).toEqual(configuration.map.options.maxZoom)
    expect(minZoomFromConfig).toEqual(configuration.map.options.minZoom)
  })
})
