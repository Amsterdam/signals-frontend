// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useContext as mockUseContext } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mocked } from 'jest-mock'
import { Provider } from 'react-redux'

import configureStore from 'configureStore'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import mockAssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { withAppContext } from 'test/utils'
import type { Location } from 'types/incident'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import AssetSelect from '.'
import withAssetSelectContext, {
  contextValue,
} from './__tests__/withAssetSelectContext'
import type { AssetSelectProps } from './AssetSelect'
import { initialValue } from './context'
import {
  UNKNOWN_TYPE,
  UNREGISTERED_TYPE as mockUNREGISTERED_TYPE,
  UNREGISTERED_TYPE,
} from '../constants'
import type { Item } from '../types'

const mockLatLng = { lat: 10, lng: 20 }
const mockItem = {
  id: 12398712,
  location: {},
  type: 'not-mapped-or-something',
  label: 'foo bar',
}
const mockItemCoordinates = { lat: 4, lng: 36 }

jest.mock('shared/services/reverse-geocoder')

const mockMapClose = jest.fn()

jest.mock('./Selector', () => () => {
  const { fetchLocation, removeItem, setItem, setLocation } = mockUseContext(
    mockAssetSelectContext
  )

  const item: Item = {
    ...mockItem,
    location: {
      coordinates: mockItemCoordinates,
    },
    label: 'foo bar',
  }

  const unregisteredItem = {
    ...mockItem,
    type: mockUNREGISTERED_TYPE,
    location: {
      coordinates: mockLatLng,
    },
    label: 'foo bar',
  }

  const location: Location = {
    coordinates: mockLatLng,
    address: mockAddress,
  }

  return (
    <>
      <span
        aria-hidden="true"
        data-testid="asset-select-selector"
        onClick={() => fetchLocation(mockLatLng)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="map-close-button"
        onClick={() => mockMapClose()}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="set-item-container"
        onClick={() => setItem(item)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="set-item-container-unregistered"
        onClick={() => setItem(unregisteredItem)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="remove-item-container"
        onClick={() => removeItem(item)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="address-select-container"
        onClick={() => setLocation(location)}
        role="button"
        tabIndex={0}
      />
    </>
  )
})

const mockAddress = {
  postcode: '1000 AA',
  huisnummer: '100',
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}

const geocodedResponse = {
  id: 'foo',
  value: 'bar',
  data: {
    location: mockLatLng,
    address: mockAddress,
  },
}

describe('AssetSelect', () => {
  let props: AssetSelectProps
  const updateIncident = jest.fn()
  const addToSelection = jest.fn()
  const removeFromSelection = jest.fn()
  const location = incidentJson.location as unknown as Location

  beforeEach(() => {
    props = {
      value: undefined,
      meta: {
        ...initialValue.meta,
        name: 'Zork',
      },
      parent: {
        meta: {
          incidentContainer: { incident: { location } },
          updateIncident,
          featureTypes: initialValue.meta.featureTypes,
          featureStatusTypes: [],
          addToSelection,
          removeFromSelection,
        },
      },
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Intro', () => {
    render(
      withAppContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    expect(screen.queryByTestId('asset-select-intro')).toBeInTheDocument()
    expect(
      screen.queryByTestId('asset-select-selector')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('asset-select-summary')).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(
      withAppContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    expect(screen.queryByTestId('asset-select-intro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('asset-select-selector')).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    const store = configureStore({}).store

    render(
      withAppContext(
        <Provider store={store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    expect(screen.queryByTestId('asset-select-selector')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('map-close-button'))

    expect(mockMapClose).toBeCalled()
  })

  it('renders the Summary when an object has been selected', () => {
    render(
      withAppContext(
        <AssetSelect
          {...props}
          value={{
            selection: [
              {
                id: 'PL734',
                type: 'plastic',
                description: 'Plastic asset',
                iconUrl: '',
                label: 'foo bar',
              },
            ],
          }}
        />
      )
    )

    expect(
      screen.queryByTestId('asset-select-selector')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('asset-select-summary')).toBeInTheDocument()
  })

  it('renders the Summary when a location has been pinned', () => {
    const value = {
      selection: [
        {
          type: UNREGISTERED_TYPE,
        },
      ],
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
    }

    render(withAppContext(<AssetSelect {...props} value={value} />))

    expect(
      screen.queryByTestId('asset-select-selector')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('asset-select-summary')).toBeInTheDocument()
  })

  it('handles click on map when point has an associated address', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )
    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    const assetSelectSelector = screen.getByTestId('asset-select-selector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    const payload = {
      location: {
        coordinates: mockLatLng,
      },
      [props.meta.name as string]: {
        selection: undefined,
        location: {
          address: undefined,
          coordinates: mockLatLng,
        },
      },
      meta_name: 'Zork',
    }

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith(payload)

    await screen.findByTestId('asset-select-selector')

    const payloadWithAddress = {
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
      [props.meta.name as string]: {
        selection: undefined,
        location: {
          coordinates: mockLatLng,
          address: mockAddress,
        },
      },
      meta_name: 'Zork',
    }

    expect(updateIncident).toHaveBeenCalledTimes(2)
    expect(updateIncident).toHaveBeenLastCalledWith(payloadWithAddress)
  })

  it('handles click on map when point does not have an associated address', async () => {
    const geocodedResponse = undefined

    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    const assetSelectSelector = screen.getByTestId('asset-select-selector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    await screen.findByTestId('asset-select-selector')

    expect(updateIncident).toHaveBeenCalledWith({
      location: { coordinates: mockLatLng, address: undefined },
      [props.meta.name as string]: {
        selection: undefined,
        location: { coordinates: mockLatLng, address: undefined },
      },
      meta_name: 'Zork',
    })
  })

  it('handles click on map with already selected object', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    const value = {
      selection: [
        {
          type: UNKNOWN_TYPE,
        },
      ],
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
    }

    const meta = {
      ...contextValue.meta,
      name: 'FooBar',
    }

    const store = configureStore({}).store

    const { rerender } = render(
      withAssetSelectContext(
        <Provider store={store}>
          <AssetSelect {...props} value={value} />
        </Provider>,
        {
          ...contextValue,
          meta,
        }
      )
    )

    // open map
    userEvent.click(screen.getByTestId('map-edit-button'))

    // select item
    userEvent.click(screen.getByTestId('set-item-container'))

    const item = {
      ...mockItem,
      location: {
        coordinates: { lat: 4, lng: 36 },
      },
      label: 'foo bar',
    }

    // setting an item will dispatch an action to the global store and, in turn, will rerender
    // the AssetSelect component, so we need to do that as well:

    rerender(
      withAssetSelectContext(
        <Provider store={store}>
          <AssetSelect {...props} value={{ selection: [item] }} />
        </Provider>,
        {
          ...contextValue,
          meta,
        }
      )
    )

    // // simulate click on map
    userEvent.click(screen.getByTestId('asset-select-selector'))

    await screen.findByTestId('asset-select-selector')

    expect(updateIncident).toHaveBeenCalledTimes(2)
    //expect(removeFromSelection).toHaveBeenCalled()
    expect(addToSelection).toHaveBeenCalled()
    expect(updateIncident).toHaveBeenLastCalledWith({
      Zork: {
        selection: undefined,
        location: {
          address: mockAddress,
          coordinates: mockLatLng,
        },
      },
      location: {
        address: mockAddress,
        coordinates: mockLatLng,
      },
      meta_name: 'Zork',
    })
  })

  it('handles setting a selected item', () => {
    const location = {
      coordinates: mockLatLng,
    }

    const value = {
      selection: [
        {
          type: UNKNOWN_TYPE,
          id: '08u2349823',
        },
      ],
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('map-edit-button'))

    const setItemContainer = screen.getByTestId('set-item-container')

    expect(addToSelection).not.toHaveBeenCalled()

    userEvent.click(setItemContainer)

    expect(addToSelection).toHaveBeenCalledWith({
      location,
      Zork: {
        location,
        maxNumberOfAssets: 1,
        selection: [
          {
            ...mockItem,
            location: {
              coordinates: mockItemCoordinates,
            },
          },
        ],
      },
      meta_name: 'Zork',
    })
  })

  it('handles setting a selected, unregistered item', () => {
    const location = {
      coordinates: mockLatLng,
    }
    const value = {
      selection: [
        {
          type: UNREGISTERED_TYPE,
          id: '08u2349823',
        },
      ],
      maxNumberOfAssets: 1,
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('map-edit-button'))

    const setItemContainerUnregistered = screen.getByTestId(
      'set-item-container-unregistered'
    )

    expect(addToSelection).not.toHaveBeenCalled()

    userEvent.click(setItemContainerUnregistered)

    expect(addToSelection).toHaveBeenCalledTimes(1)
    expect(addToSelection).toHaveBeenCalledWith({
      location,
      Zork: {
        location,
        maxNumberOfAssets: 1,
        selection: [
          {
            ...mockItem,
            type: mockUNREGISTERED_TYPE,
            location,
          },
        ],
      },
      meta_name: 'Zork',
    })
  })

  it('handles removing a selected item', () => {
    const location = {
      coordinates: mockLatLng,
    }
    const value = {
      selection: [
        {
          type: UNREGISTERED_TYPE,
          id: '08u2349823',
        },
      ],
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('map-edit-button'))

    const removeItemContainer = screen.getByTestId('remove-item-container')

    expect(removeFromSelection).not.toHaveBeenCalled()

    userEvent.click(removeItemContainer)

    expect(removeFromSelection).toHaveBeenCalledTimes(1)
    expect(removeFromSelection).toHaveBeenCalledWith({
      location: undefined,
      Zork: {
        selection: [
          {
            id: 12398712,
            label: 'foo bar',
            type: 'not-mapped-or-something',
            location: {
              coordinates: {
                lat: 4,
                lng: 36,
              },
            },
          },
        ],
      },
      meta_name: 'Zork',
    })
  })

  it('handles setting a location, without having to fetch the address', () => {
    const value = {
      selection: [
        {
          type: UNKNOWN_TYPE,
          id: '08u2349823',
        },
      ],
    }

    render(
      withAssetSelectContext(
        <Provider store={configureStore({}).store}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('map-edit-button'))

    const addressSelectContainer = screen.getByTestId(
      'address-select-container'
    )

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(addressSelectContainer)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
      Zork: {
        selection: [
          {
            type: UNKNOWN_TYPE,
            id: '08u2349823',
          },
        ],
        location: {
          coordinates: mockLatLng,
          address: mockAddress,
        },
      },
      meta_name: 'Zork',
    })
  })
})
