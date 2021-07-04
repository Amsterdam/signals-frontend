// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import { useContext } from 'react'
import type { MapOptions } from 'leaflet'
import { LatLng } from 'leaflet'

import { render, screen } from '@testing-library/react'
import type { FetchMock } from 'jest-fetch-mock'
import type { FeatureCollection } from 'geojson'

import { Map } from '@amsterdam/react-maps'
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { SelectValue } from '../../types'
import WfsDataContext, {
  INITIAL_STATE,
} from '../../../components/DataContext/context'
import WfsLayer from '../WfsLayer'
import * as useLayerVisible from '../../../hooks/useLayerVisible'
import { SelectProvider } from '../../context/context'

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

  it.only('should render the wfs layer in the map', async () => {
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

  it('should console.error when other error occurs in the wfs call', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const error = new Error()
    error.name = 'OtherError'
    fetchMock.mockRejectOnce(error)
    render(
      withMapCaterpillar(
        <WfsLayer>
          <TestLayer />
        </WfsLayer>
      )
    )

    await screen.findByTestId('map-test')
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockClear()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('supports additional wfs filters', () => {
    fetchMock.mockResponse(JSON.stringify(caterpillarsJson), { status: 200 })
    const filterValue =
      '<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo>'
    const endpoint = '/endpoint'
    const SelectProviderValue: SelectValue = {
      selection: [],
      location: new LatLng(0, 0),
      meta: {
        endpoint,
        featureTypes: [],
        wfsFilter: filterValue,
        name: 'Wfs',
        icons: [],
        legendItems: [],
        extraProperties: [],
      },
      update: jest.fn(),
      edit: jest.fn(),
      close: jest.fn(),
      setMessage: jest.fn(),
    }

    const urlWithFilter = `${endpoint}&Filter=<Filter><And>${filterValue}<BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="urn:ogc:def:crs:EPSG::4326"><lowerCorner>4.879893974954347 52.37309163108818</lowerCorner><upperCorner>4.879893974954347 52.37309163108818</upperCorner></gml:Envelope></BBOX></And></Filter>`
    const urlWithoutFilter = `${endpoint}&Filter=<Filter><BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="urn:ogc:def:crs:EPSG::4326"><lowerCorner>4.879893974954347 52.37309163108818</lowerCorner><upperCorner>4.879893974954347 52.37309163108818</upperCorner></gml:Envelope></BBOX></Filter>`

    const { rerender } = render(
      withMapCaterpillar(
        <SelectProvider value={SelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </SelectProvider>
      )
    )

    expect(fetchMock).toHaveBeenCalledWith(
      urlWithFilter,
      expect.objectContaining({})
    )

    delete SelectProviderValue.meta.wfsFilter

    rerender(
      withMapCaterpillar(
        <SelectProvider value={SelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </SelectProvider>
      )
    )

    expect(fetchMock).toHaveBeenCalledWith(
      urlWithoutFilter,
      expect.objectContaining({})
    )
  })
})
