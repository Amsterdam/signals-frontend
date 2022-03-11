import { render, screen } from '@testing-library/react'
import Leaflet from 'leaflet'
import * as reactRedux from 'react-redux'

import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'
import geography from 'utils/__tests__/fixtures/geography_public.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import Map from 'components/Map'
import withAssetSelectContext from '../../__tests__/withAssetSelectContext'
import Nearby, { nearbyMarkerIcon } from './Nearby'

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

const mockUseMapInstance = {
  addLayer: jest.fn(),
  getBounds: mockGetBounds,
  removeLayer: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
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
        <Nearby />
      </Map>
    )
  )

describe('Nearby', () => {
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

    expect(screen.getByTestId('nearby')).toBeInTheDocument()
  })

  it('sends a request to the API on mount ', async () => {
    expect(get).not.toHaveBeenCalled()

    renderWithContext()

    await screen.findByTestId('nearby')

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
    // expect(mockFeatureGroup.clearLayers).not.toHaveBeenCalled()
    expect(
      Leaflet.FeatureGroup.prototype.clearAllEventListeners
    ).not.toHaveBeenCalled()

    renderWithContext()

    await screen.findByTestId('nearby')

    expect(
      Leaflet.FeatureGroup.prototype.clearAllEventListeners
    ).toHaveBeenCalled()
    // expect(mockFeatureGroup.clearLayers).toHaveBeenCalled()
    expect(mockUseMapInstance.removeLayer).toHaveBeenCalled()
  })
})
