import { render, screen } from '@testing-library/react'
import Leaflet from 'leaflet'
import * as reactRedux from 'react-redux'

import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'
import geography from 'utils/__tests__/fixtures/geography_public.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import Map from 'components/Map'
import * as useLayerVisible from '../../../hooks/useLayerVisible'
import withAssetSelectContext from '../../__tests__/withAssetSelectContext'
import NearbyLayer, { nearbyMarkerIcon } from './NearbyLayer'

const east = 4.899032528058569
const north = 52.36966337175116
const south = 52.36714374096002
const west = 4.8958566562555035

const mockGetBounds = jest.fn(() => ({
  getEast: () => east,
  getNorth: () => north,
  getSouth: () => south,
  getWest: () => west,
}))

const mockGetZoom = jest.fn(() => ({
  max: 12,
}))

const mockUseMapInstance = {
  addLayer: jest.fn(),
  getBounds: mockGetBounds,
  removeLayer: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  getZoom: mockGetZoom,
}
const category = 'afval'
const subcategory = 'huisvuil'
const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()
const put = jest.fn()

const useFetchResponse = {
  get,
  patch,
  post,
  put,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}

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
})
