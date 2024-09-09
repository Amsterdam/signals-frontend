// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import 'jest-styled-components'
import type { FC } from 'react'
import type { ReactPropTypes } from 'react'

import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MapOptions } from 'leaflet'
import * as reactRedux from 'react-redux'
import * as reactResponsive from 'react-responsive'
import * as scrollLock from 'scroll-lock'

import type { MapProps } from 'components/Map/Map'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import MockInstance = jest.MockInstance
import type { LegendPanelProps } from './LegendPanel/LegendPanel'
import Selector, { MAP_LOCATION_ZOOM } from './Selector'
import type { PDOKAutoSuggestProps } from '../../../../../../../components/PDOKAutoSuggest'
import type { PdokResponse } from '../../../../../../../shared/services/map-location'
import withAssetSelectContext, {
  contextValue,
} from '../__tests__/withAssetSelectContext'

jest.useFakeTimers()

jest.mock('scroll-lock')
jest.mock('../../hooks/useLayerVisible', () => ({
  __esModule: true,
  default: () => false,
}))

let mockShowDesktopVariant: boolean
jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [mockShowDesktopVariant],
}))

jest.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('./LegendPanel', () => ({ onClose }: LegendPanelProps) => (
  <span data-testid="mock-legend-panel">
    <input type="button" name="closeLegend" onClick={onClose} />
  </span>
))

let actualMapOptions: MapOptions | null = null
jest.mock('components/Map', () => {
  const originalModule = jest.requireActual('components/Map')
  return {
    __esModule: true,
    default: ({ mapOptions, ...props }: MapProps) => {
      actualMapOptions = mapOptions
      return originalModule.default({ mapOptions, ...props })
    },
  }
})

const mockAddress = {
  postcode: '1000 AA',
  huisnummer: '100',
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}

const mockPDOKResponse: PdokResponse = {
  id: 'foo',
  value: 'Zork',
  data: {
    location: {
      lat: 12.282,
      lng: 3.141,
    },
    address: mockAddress,
  },
}

const mockList = (props: ReactPropTypes) => (
  <ul className="suggestList" {...props}>
    <li>Suggestion #1</li>
    <li>Suggestion #2</li>
  </ul>
)

jest.mock(
  'components/PDOKAutoSuggest',
  () =>
    ({
      className,
      onSelect,
      value,
      onClear,
      onFocus,
      onData,
      showListChanged,
    }: PDOKAutoSuggestProps) =>
      (
        <span data-testid="pdok-auto-suggest" className={className}>
          <button data-testid="auto-suggest-clear" onClick={onClear}>
            Clear input
          </button>
          <button
            data-testid="auto-suggest-onselect"
            onClick={() => onSelect(mockPDOKResponse)}
          >
            selectItem
          </button>
          <button
            data-testid="get-data-mock-button"
            type="button"
            onClick={() => {
              if (onData && showListChanged) {
                onData(mockList)
                showListChanged(true)
              }
            }}
          />
          <input
            data-testid="auto-suggest-input"
            type="text"
            onFocus={onFocus}
          />
          <span>{value}</span>
        </span>
      )
)

const dispatch = jest.fn()
const objectTypeSingular = contextValue?.meta?.language?.objectTypeSingular
const objectTypePlural = contextValue?.meta?.language?.objectTypePlural

describe('signals/incident/components/form/AssetSelect/Selector', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
      global.document,
      'dispatchEvent'
    )
    dispatch.mockReset()
    dispatchEventSpy.mockReset()
    mockShowDesktopVariant = false
    actualMapOptions = null
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should render the component', async () => {
    render(withAssetSelectContext(<Selector />))

    expect(
      await screen.findByTestId('asset-select-selector')
    ).toBeInTheDocument()
    expect(screen.getByTestId('gps-button')).toBeInTheDocument()
  })

  it('should render the layer when passed as prop', () => {
    const Layer: FC<any> = () => <span data-testid="test-layer" />
    render(
      withAssetSelectContext(<Selector />, { ...contextValue, layer: Layer })
    )

    expect(screen.getByTestId('test-layer')).toBeInTheDocument()
  })

  describe('zoom levels', () => {
    it('should use configuration defaults when no coordinates', async () => {
      render(
        withAssetSelectContext(<Selector />, {
          ...contextValue,
          coordinates: undefined,
        })
      )
      await screen.findByTestId('asset-select-selector')
      expect(actualMapOptions).toEqual(
        expect.objectContaining({
          maxZoom: configuration.map.options.maxZoom,
          minZoom: configuration.map.options.minZoom,
          zoom: configuration.map.options.zoom,
        })
      )
    })

    it('should zoom to MAP_LOCATION_ZOOM', async () => {
      render(withAssetSelectContext(<Selector />))
      await screen.findByTestId('asset-select-selector')
      expect(actualMapOptions).toEqual(
        expect.objectContaining({ zoom: MAP_LOCATION_ZOOM })
      )
    })

    it('should not zoom in further than maxZoom in config', async () => {
      const maxZoom = MAP_OPTIONS.maxZoom
      MAP_OPTIONS.maxZoom = MAP_LOCATION_ZOOM - 1
      render(withAssetSelectContext(<Selector />))
      await screen.findByTestId('asset-select-selector')
      expect(actualMapOptions).toEqual(
        expect.objectContaining({ zoom: MAP_OPTIONS.maxZoom })
      )
      MAP_OPTIONS.maxZoom = maxZoom
    })
  })

  it('should call close when closing the selector', async () => {
    render(withAssetSelectContext(<Selector />))
    expect(dispatch).not.toHaveBeenCalledWith(closeMap())

    const button = await screen.findByText('Meld dit object')
    userEvent.click(button)
    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })

  it('renders detail panel', async () => {
    mockShowDesktopVariant = true
    render(withAssetSelectContext(<Selector />))

    expect(await screen.findByTestId('detail-panel')).toBeInTheDocument()
  })

  it('renders a pin marker when there is a location', async () => {
    const coordinates = { lat: 52.3731081, lng: 4.8932945 }

    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        coordinates,
        selection: undefined,
      })
    )
    await screen.findByTestId('asset-select-selector')

    expect(screen.getByTestId('asset-pin-marker')).toBeInTheDocument()
  })

  it('does not render a pin marker', async () => {
    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        coordinates: undefined,
      })
    )
    await screen.findByTestId('asset-select-selector')

    expect(screen.queryByTestId('asset-pin-marker')).not.toBeInTheDocument()
  })

  it('dispatches the location when the map is clicked', async () => {
    const { coordinates, fetchLocation } = contextValue

    render(withAssetSelectContext(<Selector />))

    await screen.findByTestId('asset-select-selector')

    expect(fetchLocation).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('map-base'), {
      clientX: 10,
      clientY: 10,
    })

    jest.runOnlyPendingTimers()

    expect(fetchLocation).toHaveBeenCalledWith(
      expect.not.objectContaining(coordinates)
    )
  })

  it('gets the current position when a location is retrieved via geolocation', async () => {
    const { coordinates } = contextValue
    const coords = {
      accuracy: 50,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
    }

    const getCurrentPosition = jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords,
        })
      )
    )

    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition },
    })

    render(withAssetSelectContext(<Selector />))

    expect(getCurrentPosition).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('gps-button'))

    expect(getCurrentPosition).toHaveBeenCalled()
  })

  it('only renders the zoom message when feature types are available', () => {
    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        meta: { ...contextValue.meta, featureTypes: [] },
      })
    )

    expect(screen.queryByTestId('zoom-message')).not.toBeInTheDocument()

    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        meta: {
          ...contextValue.meta,
          featureTypes: contextValue.meta.featureTypes,
        },
      })
    )

    expect(screen.queryByTestId('zoom-message')).toBeInTheDocument()
  })

  it('fetches the location when the button is pressed', () => {
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
    })

    const { fetchLocation } = contextValue

    render(withAssetSelectContext(<Selector />))

    expect(fetchLocation).not.toHaveBeenCalled()
    userEvent.click(screen.getByRole('button', { name: 'Huidige locatie' }))

    expect(fetchLocation).toHaveBeenCalledWith({
      lat: coords.latitude,
      lng: coords.longitude,
    })
  })

  it('renders a location marker', () => {
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
  })

  it('shows a notification whenever the location cannot be retrieved', () => {
    const code = 1
    const message = 'User denied geolocation'
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((_, error) =>
        Promise.resolve(
          error({
            code,
            message,
          })
        )
      ),
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })

    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        selection: undefined,
      })
    )

    userEvent.click(screen.getByTestId('gps-button'))

    expect(screen.getByTestId('map-message')).toBeInTheDocument()
    expect(screen.getByTestId('map-message')).toHaveTextContent(
      `${configuration.language.siteAddress} heeft geen toestemming om uw locatie te gebruiken.`
    )
  })

  it('shows a notification whenever the location is out of bounds', () => {
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

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })

    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        selection: undefined,
      })
    )

    userEvent.click(screen.getByTestId('gps-button'))

    expect(screen.getByTestId('map-message')).toBeInTheDocument()
    expect(screen.getByTestId('map-message')).toHaveTextContent(
      'Uw locatie valt buiten de kaart en is daardoor niet te zien'
    )

    // closing notification
    userEvent.click(
      within(screen.getByTestId('map-message')).getByRole('button')
    )

    expect(screen.queryByTestId('map-message')).not.toBeInTheDocument()
  })

  it('disables page scroll on mount', () => {
    const enablePageScroll = jest.spyOn(scrollLock, 'enablePageScroll')
    const disablePageScroll = jest.spyOn(scrollLock, 'disablePageScroll')

    const scrollTo = jest.fn()
    global.window.scrollTo = scrollTo

    expect(disablePageScroll).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()

    const { unmount } = render(withAssetSelectContext(<Selector />))

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(disablePageScroll).toHaveBeenCalledTimes(1)

    unmount()

    expect(enablePageScroll).toHaveBeenCalled()
  })

  describe('notification when more than the max number of assets has been selected', () => {
    beforeEach(() => {
      const maxAssetWarning = true

      jest.spyOn(reactRedux, 'useSelector').mockReturnValue({ maxAssetWarning })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('shows a notification when 1 asset is maximum and removes it when hitting the close button', () => {
      render(
        withAssetSelectContext(<Selector />, {
          ...contextValue,
        })
      )

      expect(
        screen.getByText(`U kunt maximaal 1 ${objectTypeSingular} kiezen.`)
      ).toBeInTheDocument()
    })

    it('shows a notification when more than 1 asset is maximum', () => {
      render(
        withAssetSelectContext(<Selector />, {
          ...contextValue,
          meta: {
            ...contextValue.meta,
            maxNumberOfAssets: 2,
          },
        })
      )

      expect(
        screen.queryByText(`U kunt maximaal 1 ${objectTypeSingular} kiezen.`)
      ).not.toBeInTheDocument()
      expect(
        screen.getByText(`U kunt maximaal 2 ${objectTypePlural} kiezen.`)
      ).toBeInTheDocument()
    })
  })

  it('renders the address panel', async () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(withAssetSelectContext(<Selector />))

    expect(
      await screen.findByTestId('asset-select-selector')
    ).toBeInTheDocument()

    expect(screen.queryByTestId('address-panel')).toBeInTheDocument()

    fireEvent.focus(screen.getByTestId('auto-suggest-input'))

    expect(screen.getByTestId('address-panel')).toBeInTheDocument()
  })

  it('renders a list of options in the address panel', async () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(withAssetSelectContext(<Selector />))

    expect(
      await screen.findByTestId('asset-select-selector')
    ).toBeInTheDocument()

    expect(screen.queryByTestId('address-panel')).toBeInTheDocument()

    fireEvent.focus(screen.getByTestId('auto-suggest-input'))

    expect(screen.queryByTestId('options-list')).not.toBeInTheDocument()

    // simulate data retrieval
    userEvent.click(
      within(screen.getByTestId('address-panel')).getByTestId(
        'get-data-mock-button'
      )
    )

    expect(screen.getByTestId('options-list')).toBeInTheDocument()
  })

  it('should dispatch closeMap when clicking back button', async () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(withAssetSelectContext(<Selector />))

    expect(
      await screen.findByTestId('asset-select-selector')
    ).toBeInTheDocument()

    expect(screen.queryByTestId('address-panel')).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: 'Terug' }))

    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })
})
