/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2021 - 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import Leaflet from 'leaflet'
import * as reactRedux from 'react-redux'

import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'
import geography from 'utils/__tests__/fixtures/geography_public.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import Map from 'components/Map'
import type { FeatureCollection } from 'geojson'
import {
  get,
  mockUseMapInstance,
  useFetchResponse,
} from 'signals/IncidentMap/components/mapTestUtils'
import * as useLayerVisible from '../../../hooks/useLayerVisible'
import withAssetSelectContext from '../../__tests__/withAssetSelectContext'
import { WfsDataProvider } from '../WfsLayer/context'
import NearbyLayer, { findAssetMatch, nearbyMarkerIcon } from './NearbyLayer'

const category = 'afval'
const subcategory = 'huisvuil'

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  ...jest.requireActual('@amsterdam/react-maps'),
  useMapInstance: jest.fn(() => mockUseMapInstance),
}))

jest.mock('hooks/useFetch')
jest.mock('react-redux', () => jest.requireActual('react-redux'))

const numFeatures = geography.features.length

const renderWithContext = () =>
  render(
    withAssetSelectContext(
      <Map mapOptions={MAP_OPTIONS}>
        <NearbyLayer zoomLevel={{ max: 13 }} />
      </Map>
    )
  )

describe('NearbyLayer', () => {
  beforeEach(() => {
    get.mockReset()

    Leaflet.FeatureGroup.prototype.addLayer = jest.fn()
    Leaflet.FeatureGroup.prototype.clearLayers = jest.fn()
    Leaflet.FeatureGroup.prototype.clearAllEventListeners = jest.fn()
    Leaflet.Marker.prototype.setIcon = jest.fn()

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValue({ category, subcategory })

    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('renders a span placeholder for test await and QA purposes', () => {
    renderWithContext()

    expect(screen.getByTestId('nearbyLayer')).toBeInTheDocument()
  })

  it('sends a request to the API on mount when the zoom level is sufficiently deep', async () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => true)
    expect(get).not.toHaveBeenCalled()

    renderWithContext()

    await screen.findByTestId('nearbyLayer')

    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
  })

  it('renders markers', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: geography,
    }))

    expect(Leaflet.FeatureGroup.prototype.addLayer).not.toHaveBeenCalled()

    renderWithContext()

    expect(Leaflet.FeatureGroup.prototype.addLayer).toHaveBeenCalledTimes(
      numFeatures
    )

    expect(Leaflet.Marker.prototype.setIcon).toHaveBeenCalledTimes(numFeatures)
    expect(Leaflet.Marker.prototype.setIcon).toHaveBeenCalledWith(
      nearbyMarkerIcon
    )
  })

  it('does not render a marker on top of an asset marker', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: geography,
    }))

    const containerJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'container.118431',
          geometry_name: '118431',
          geometry: {
            type: 'Point',
            coordinates: [4.90459473852556, 52.3884112183925],
          },
          properties: {
            id: '118431',
          },
        },
      ],
    }

    expect(Leaflet.FeatureGroup.prototype.addLayer).not.toHaveBeenCalled()

    render(
      withAssetSelectContext(
        <Map mapOptions={MAP_OPTIONS}>
          <WfsDataProvider value={containerJson as FeatureCollection}>
            <NearbyLayer zoomLevel={{ max: 13 }} />
          </WfsDataProvider>
        </Map>
      )
    )

    expect(Leaflet.FeatureGroup.prototype.addLayer).toHaveBeenCalledTimes(
      numFeatures - 1
    )
    expect(Leaflet.Marker.prototype.setIcon).toHaveBeenCalledTimes(
      numFeatures - 1
    )
  })

  it('clears the feature group when the API returns an error ', async () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: undefined,
      error: true,
    }))

    expect(mockUseMapInstance.removeLayer).not.toHaveBeenCalled()
    expect(
      Leaflet.FeatureGroup.prototype.clearAllEventListeners
    ).not.toHaveBeenCalled()

    renderWithContext()

    await screen.findByTestId('nearbyLayer')

    expect(
      Leaflet.FeatureGroup.prototype.clearAllEventListeners
    ).toHaveBeenCalled()
    expect(mockUseMapInstance.removeLayer).toHaveBeenCalled()
  })

  it('clears the nearby markers when sufficiently zoomed out', async () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => true)
    const { rerender } = renderWithContext()

    await screen.findByTestId('nearbyLayer')

    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => false)
    rerender(
      withAssetSelectContext(
        <Map mapOptions={MAP_OPTIONS}>
          <NearbyLayer zoomLevel={{ max: 13 }} />
        </Map>
      )
    )

    expect(Leaflet.FeatureGroup.prototype.clearLayers).toHaveBeenCalled()
  })

  describe('findAssetMatch', () => {
    it('returns true if an asset marker is present at the given location', () => {
      const lat = 52.3884112183925
      const lng = 4.90459473852556
      expect(
        findAssetMatch(geography as FeatureCollection, lat, lng)
      ).toBeTruthy()
    })

    it('returns undefined if no asset marker is present at the given location', () => {
      const lat = 53.3693842041523
      const lng = 5.89186680128628
      expect(
        findAssetMatch(geography as FeatureCollection, lat, lng)
      ).toBeUndefined()
    })
  })
})
