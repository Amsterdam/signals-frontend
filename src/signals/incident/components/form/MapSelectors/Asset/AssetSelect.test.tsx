// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext as mockUseContext } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'
import mockAssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { mocked } from 'jest-mock'
import type { Location } from 'types/incident'
import { Provider } from 'react-redux'
import { setupStore } from 'signals/incident/containers/IncidentContainer/testReducer'
import {
  UNKNOWN_TYPE,
  UNREGISTERED_TYPE as mockUNREGISTERED_TYPE,
  UNREGISTERED_TYPE,
} from '../constants'
import type { Item } from '../types'
import type { AssetSelectProps } from './AssetSelect'

import { initialValue } from './context'
import withAssetSelectContext, {
  contextValue,
} from './__tests__/withAssetSelectContext'
import AssetSelect from '.'

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
        data-testid="assetSelectSelector"
        onClick={() => fetchLocation(mockLatLng)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="mapCloseButton"
        onClick={() => mockMapClose()}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="setItemContainer"
        onClick={() => setItem(item)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="setItemContainerUnregistered"
        onClick={() => setItem(unregisteredItem)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="removeItemContainer"
        onClick={removeItem}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="addressSelectContainer"
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
        <Provider store={setupStore()}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    expect(screen.queryByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(
      withAppContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    const store = setupStore()

    render(
      withAppContext(
        <Provider store={store}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('mapCloseButton'))

    expect(mockMapClose).toBeCalled()
  })

  it('renders the Summary when an object has been selected', () => {
    render(
      withAppContext(
        <AssetSelect
          {...props}
          value={{
            selection: {
              id: 'PL734',
              type: 'plastic',
              description: 'Plastic asset',
              iconUrl: '',
              label: 'foo bar',
            },
          }}
        />
      )
    )

    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).toBeInTheDocument()
  })

  it('renders the Summary when a location has been pinned', () => {
    const value = {
      selection: {
        type: UNREGISTERED_TYPE,
      },
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
    }

    render(withAppContext(<AssetSelect {...props} value={value} />))

    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).toBeInTheDocument()
  })

  it('handles click on map when point has an associated address', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )
    render(
      withAssetSelectContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    const payload = {
      location: {
        coordinates: mockLatLng,
      },
      [props.meta.name as string]: {
        selection: undefined,
        location: {
          coordinates: mockLatLng,
        },
      },
    }

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith(payload)

    await screen.findByTestId('assetSelectSelector')

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
        <Provider store={setupStore()}>
          <AssetSelect {...props} />
        </Provider>
      )
    )

    userEvent.click(screen.getByText(/kies locatie/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledWith({
      location: { coordinates: mockLatLng, address: undefined },
      [props.meta.name as string]: {
        selection: undefined,
        location: { coordinates: mockLatLng, address: undefined },
      },
    })
  })

  it('handles click on map with already selected object', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    const value = {
      selection: {
        type: UNKNOWN_TYPE,
      },
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
    }

    const meta = {
      ...contextValue.meta,
      name: 'FooBar',
    }

    const store = setupStore()

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
    userEvent.click(screen.getByTestId('mapEditButton'))

    // select item
    userEvent.click(screen.getByTestId('setItemContainer'))

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
          <AssetSelect {...props} value={{ selection: item }} />
        </Provider>,
        {
          ...contextValue,
          meta,
        }
      )
    )

    // // simulate click on map
    userEvent.click(screen.getByTestId('assetSelectSelector'))

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledTimes(3)
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
    })
  })

  it('handles setting a selected item', () => {
    const location = {
      coordinates: mockLatLng,
    }

    const value = {
      selection: {
        type: UNKNOWN_TYPE,
        id: '08u2349823',
      },
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('mapEditButton'))

    const setItemContainer = screen.getByTestId('setItemContainer')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(setItemContainer)

    expect(updateIncident).toHaveBeenCalledWith({
      location,
      Zork: {
        location,
        selection: {
          ...mockItem,
          location: {
            coordinates: mockItemCoordinates,
          },
        },
      },
    })
  })

  it('handles setting a selected, unregistered item', () => {
    const location = {
      coordinates: mockLatLng,
    }
    const value = {
      selection: {
        type: UNREGISTERED_TYPE,
        id: '08u2349823',
      },
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('mapEditButton'))

    const setItemContainerUnregistered = screen.getByTestId(
      'setItemContainerUnregistered'
    )

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(setItemContainerUnregistered)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location,
      Zork: {
        location,
        selection: {
          ...mockItem,
          type: mockUNREGISTERED_TYPE,
          location,
        },
      },
    })
  })

  it('handles removing a selected item', () => {
    const location = {
      coordinates: mockLatLng,
    }
    const value = {
      selection: {
        type: UNREGISTERED_TYPE,
        id: '08u2349823',
      },
      location,
    }

    render(
      withAssetSelectContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('mapEditButton'))

    const removeItemContainer = screen.getByTestId('removeItemContainer')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(removeItemContainer)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: undefined,
      Zork: undefined,
    })
  })

  it('handles setting a location, without having to fetch the address', () => {
    const value = {
      selection: {
        type: UNKNOWN_TYPE,
        id: '08u2349823',
      },
    }

    render(
      withAssetSelectContext(
        <Provider store={setupStore()}>
          <AssetSelect {...props} value={value} />
        </Provider>
      )
    )

    userEvent.click(screen.getByTestId('mapEditButton'))

    const addressSelectContainer = screen.getByTestId('addressSelectContainer')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(addressSelectContainer)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: {
        coordinates: mockLatLng,
        address: mockAddress,
      },
      Zork: {
        selection: {
          type: UNKNOWN_TYPE,
          id: '08u2349823',
        },
        location: {
          coordinates: mockLatLng,
          address: mockAddress,
        },
      },
    })
  })
})
