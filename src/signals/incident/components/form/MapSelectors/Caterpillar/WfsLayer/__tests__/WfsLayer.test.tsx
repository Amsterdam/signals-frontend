// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import { useContext } from 'react'
import type { MapOptions } from 'leaflet'

import { render, screen } from '@testing-library/react'
import type { FetchMock } from 'jest-fetch-mock'
import type { FeatureCollection } from 'geojson'
import * as Sentry from '@sentry/browser'

import { Map } from '@amsterdam/react-maps'
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import WfsDataContext, {
  INITIAL_STATE,
} from '../../../components/DataContext/context'
import WfsLayer from '../WfsLayer'
import * as useLayerVisible from '../../../hooks/useLayerVisible'

jest.spyOn(Sentry, 'captureException')

const fetchMock = fetch as FetchMock

const options = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
} as MapOptions

const withMapCaterpillar = (Component: ReactNode) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
)

describe('src/signals/incident/components/form/MapSelectors/Caterpillar/WfsLayer', () => {
  const setContextData = jest.fn()
  const TestLayer: FunctionComponent = () => {
    const data = useContext<FeatureCollection>(WfsDataContext)
    setContextData(data)

    return <span data-testid="test-layer"></span>
  }

  beforeEach(() => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => true)
    fetchMock.resetMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should not render when outside zoom level does not allow it', () => {
    fetchMock.mockResponseOnce(JSON.stringify(caterpillarsJson), {
      status: 200,
    })
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => false)
    render(
      withMapCaterpillar(
        <WfsLayer zoomLevel={{ max: 15 }}>
          <TestLayer />
        </WfsLayer>
      )
    )

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should render the wfs layer in the map', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(caterpillarsJson), {
      status: 200,
    })

    render(
      withMapCaterpillar(
        <WfsLayer zoomLevel={{ max: 12 }}>
          <TestLayer />
        </WfsLayer>
      )
    )

    await screen.findByTestId('map-test')
    expect(setContextData).toHaveBeenCalledWith(caterpillarsJson)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should not render when an AbortError occurs in the wfs call', () => {
    const error = new Error()
    error.name = 'AbortError'
    fetchMock.mockRejectOnce(error)
    render(
      withMapCaterpillar(
        <WfsLayer>
          <TestLayer />
        </WfsLayer>
      )
    )

    expect(setContextData).toHaveBeenCalledWith(INITIAL_STATE)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle wfs request errors', async () => {
    const error = new Error('Foo')
    fetchMock.mockRejectOnce(error)

    render(
      withMapCaterpillar(
        <WfsLayer>
          <TestLayer />
        </WfsLayer>
      )
    )

    await screen.findByTestId('map-test')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(Sentry.captureException).toHaveBeenCalledWith(error)
  })
})
