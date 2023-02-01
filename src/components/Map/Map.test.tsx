// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'
import { withAppContext } from 'test/utils'

import MockInstance = jest.MockInstance
import Map from './Map'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
  global.document,
  'dispatchEvent'
)

describe('components/Map', () => {
  beforeEach(() => {
    dispatch.mockReset()
    dispatchEventSpy.mockReset()
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

  it('should fall back to configuration settings', () => {
    const { getByTestId, rerender, unmount } = render(
      withAppContext(<Map mapOptions={MAP_OPTIONS} />)
    )

    const maxZoom = Number.parseInt(
      (getByTestId('map-base').dataset.maxZoom || '').toString(),
      10
    )
    const minZoom = Number.parseInt(
      (getByTestId('map-base').dataset.minZoom || '').toString(),
      10
    )

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
      (getByTestId('map-base').dataset.maxZoom || '').toString(),
      10
    )
    const minZoomFromConfig = Number.parseInt(
      (getByTestId('map-base').dataset.minZoom || '').toString(),
      10
    )

    expect(maxZoomFromConfig).toEqual(configuration.map.options.maxZoom)
    expect(minZoomFromConfig).toEqual(configuration.map.options.minZoom)
  })
  it('should call dispatch with closeMap when unmounting', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({ mapActive: true })

    const { unmount } = render(withAppContext(<Map mapOptions={MAP_OPTIONS} />))

    expect(dispatch).not.toHaveBeenCalledWith(closeMap())

    unmount()

    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })
})
