// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import { useContext } from 'react'
import { act, render, screen } from '@testing-library/react'

import type { MapOptions } from 'leaflet'
import type { FetchMock } from 'jest-fetch-mock'
import type { FeatureCollection } from 'geojson'

import { Map } from '@amsterdam/react-maps'
import assetsJson from 'utils/__tests__/fixtures/assets.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import type { AssetSelectValue } from '../../types'

import WfsLayer from '../WfsLayer'
import * as useLayerVisible from '../../../hooks/useLayerVisible'
import { AssetSelectProvider } from '../../context'
import { contextValue as assetSelectContextValue } from '../../__tests__/withAssetSelectContext'

import WfsDataContext, { NO_DATA } from './context'
import { SRS_NAME } from './WfsLayer'

const fetchMock = fetch as FetchMock

const options = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
} as MapOptions

const withMapAsset = (Component: ReactNode) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
)

const consoleErrorSpy = jest.spyOn(global.console, 'error')

const endpoint = 'https://endpoint/?version=2'
const promise = Promise.resolve()
const assetSelectProviderValue: AssetSelectValue = {
  ...assetSelectContextValue,
  selection: undefined,
  coordinates: { lat: 0, lng: 0 },
  meta: {
    endpoint,
    featureTypes: [],
  },
}

describe('src/signals/incident/components/form/AssetSelect/WfsLayer', () => {
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
    consoleErrorSpy.mockClear()
    jest.resetAllMocks()
  })

  it('should not render when outside zoom level does not allow it', () => {
    fetchMock.mockResponseOnce(JSON.stringify(assetsJson), { status: 200 })
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => false)
    render(
      withMapAsset(
        <WfsLayer zoomLevel={{ max: 15 }}>
          <TestLayer />
        </WfsLayer>
      )
    )

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should render the wfs layer in the map', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(assetsJson), { status: 200 })
    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer zoomLevel={{ max: 12 }}>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    await screen.findByTestId('map-test')
    expect(setContextData).toHaveBeenCalledWith(assetsJson)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should not render when an AbortError occurs in the wfs call', () => {
    const error = new Error()
    error.name = 'AbortError'
    fetchMock.mockRejectOnce(error)
    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    expect(setContextData).toHaveBeenCalledWith(NO_DATA)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should console.error when other error occurs in the wfs call', async () => {
    const error = new Error()
    error.name = 'OtherError'
    fetchMock.mockRejectOnce(error)
    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    expect(consoleErrorSpy).not.toHaveBeenCalled()
    await screen.findByTestId('map-test')
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('supports no additional wfs filters', async () => {
    fetchMock.mockResponse(JSON.stringify(assetsJson), { status: 200 })
    const endpoint = 'https://endpoint/?version=2'
    const promise = Promise.resolve()
    const assetSelectProviderValue: AssetSelectValue = {
      ...assetSelectContextValue,
      selection: undefined,
      coordinates: { lat: 0, lng: 0 },
      meta: {
        endpoint,
        featureTypes: [],
      },
      setItem: jest.fn(() => promise),
    }

    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    expect(fetchMock).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({})
    )
    await act(() => promise)
  })

  it('supports replacements in the endpoint', async () => {
    fetchMock.mockResponse(JSON.stringify(assetsJson), { status: 200 })
    const endpoint =
      'https://endpoint/?version=2&srsName={srsName}&bbox={north},{east},{south},{west}'
    const expectedEndpoint = `https://endpoint/?version=2&srsName=${SRS_NAME}&bbox=52.37309163108818,4.879893974954347,52.37309163108818,4.879893974954347`
    const promise = Promise.resolve()
    const assetSelectProviderValue: AssetSelectValue = {
      ...assetSelectContextValue,
      selection: undefined,
      coordinates: { lat: 0, lng: 0 },
      meta: {
        endpoint,
        featureTypes: [],
      },
      setItem: jest.fn(() => promise),
    }

    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({})
    )
    await act(() => promise)
  })

  it('supports additional wfs filters', async () => {
    fetchMock.mockResponse(JSON.stringify(assetsJson), { status: 200 })
    const wfsFilter =
      '<PropertyIsEqualTo><PropertyName>geometrie</PropertyName><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope>'
    const assetSelectProviderValue: AssetSelectValue = {
      ...assetSelectContextValue,
      selection: undefined,
      coordinates: { lat: 0, lng: 0 },
      meta: {
        endpoint,
        wfsFilter,
        featureTypes: [],
      },
      setItem: jest.fn(() => promise),
    }

    const urlWithFilter =
      'https://endpoint/?version=2&filter=%3CFilter%3E%3CAnd%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Egeometrie%3C%2FPropertyName%3E%3Cgml%3AEnvelope+srsName%3D%22EPSG%3A4326%22%3E%3ClowerCorner%3E4.879893974954347+52.37309163108818%3C%2FlowerCorner%3E%3CupperCorner%3E4.879893974954347+52.37309163108818%3C%2FupperCorner%3E%3C%2Fgml%3AEnvelope%3E%3C%2FAnd%3E%3C%2FFilter%3E'

    render(
      withMapAsset(
        <AssetSelectProvider value={assetSelectProviderValue}>
          <WfsLayer>
            <TestLayer />
          </WfsLayer>
        </AssetSelectProvider>
      )
    )

    expect(fetchMock).toHaveBeenCalledWith(
      urlWithFilter,
      expect.objectContaining({})
    )
    await act(() => promise)
  })
})
