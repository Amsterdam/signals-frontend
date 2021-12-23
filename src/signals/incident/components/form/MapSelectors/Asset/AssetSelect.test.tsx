// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext as mockUseContext } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'
import mockAssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { mocked } from 'ts-jest/utils'

import type { Location } from 'types/incident'
import { UNREGISTERED_TYPE as mockUNREGISTERED_TYPE } from '../constants'
import type { AssetSelectProps } from './AssetSelect'
import type { Item } from './types'

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
}

jest.mock('shared/services/reverse-geocoder')

jest.mock('./Selector', () => () => {
  const { fetchLocation, close, removeItem, setItem, setLocation } =
    mockUseContext(mockAssetSelectContext)

  const item: Item = {
    ...mockItem,
    location: {
      coordinates: { lat: 4, lng: 36 },
    },
  }

  const unregisteredItem = {
    ...mockItem,
    type: mockUNREGISTERED_TYPE,
    location: {
      coordinates: mockLatLng,
    },
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
        onClick={close}
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

jest.mock('react-redux', () => jest.requireActual('react-redux'))

describe('AssetSelect', () => {
  let props: AssetSelectProps
  const updateIncident = jest.fn()
  const location = incidentJson.location as unknown as Location

  beforeEach(() => {
    props = {
      handler: () => ({
        value: undefined,
      }),
      meta: {
        ...initialValue.meta,
        name: 'Zork',
      },
      parent: {
        meta: {
          incidentContainer: { incident: { location } },
          updateIncident,
        },
      },
    }

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(undefined)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Intro', () => {
    render(withAppContext(<AssetSelect {...props} />))

    expect(screen.queryByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('mapCloseButton'))

    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
  })

  it('should render the Summary', () => {
    render(
      withAppContext(
        <AssetSelect
          {...{
            ...props,
            handler: () => ({
              value: {
                id: 'PL734',
                type: 'plastic',
                description: 'Plastic asset',
                location: {},
                iconUrl: '',
              },
            }),
          }}
        />
      )
    )

    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).toBeInTheDocument()
  })

  it('handles click on map when point has an associated address', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    const payload = {
      [props.meta.name as string]: {
        type: mockUNREGISTERED_TYPE,
      },
      location: {
        coordinates: mockLatLng,
      },
    }

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith(payload)

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledTimes(2)
    expect(updateIncident).toHaveBeenLastCalledWith({
      ...payload,
      location: {
        ...payload.location,
        address: geocodedResponse.data.address,
      },
    })
  })

  it('handles click on map when point does not have an associated address', async () => {
    const geocodedResponse = undefined

    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledWith({
      [props.meta.name as string]: {
        type: mockUNREGISTERED_TYPE,
      },
      location: { coordinates: mockLatLng },
    })
  })

  it('handles click on map with already selected object', async () => {
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)

    const meta = {
      ...contextValue.meta,
      name: 'FooBar',
    }

    const { rerender } = render(
      withAssetSelectContext(<AssetSelect {...props} />, {
        ...contextValue,
        meta,
      })
    )

    // open map
    userEvent.click(screen.getByText(/kies op kaart/i))

    // select item
    userEvent.click(screen.getByTestId('setItemContainer'))

    const item = {
      ...mockItem,
      location: {
        coordinates: { lat: 4, lng: 36 },
      },
    }

    // setting an item will dispatch an action to the global store and, in turn, will rerender
    // the AssetSelect component, so we need to do that as well:
    rerender(
      withAssetSelectContext(
        <AssetSelect
          {...{
            ...props,
            handler: () => ({
              value: item,
            }),
          }}
        />,
        {
          ...contextValue,
          meta,
        }
      )
    )

    // simulate click on map
    userEvent.click(screen.getByTestId('assetSelectSelector'))

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledTimes(3)
    expect(updateIncident).toHaveBeenLastCalledWith({
      [props.meta.name as string]: {
        type: mockUNREGISTERED_TYPE,
      },
      location: {
        address: mockAddress,
        coordinates: mockLatLng,
      },
    })
  })

  it('handles setting a selected item', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const setItemContainer = screen.getByTestId('setItemContainer')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(setItemContainer)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { location, ...restItem } = mockItem

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: {
        coordinates: { lat: 4, lng: 36 },
        address: undefined,
      },
      Zork: restItem,
    })
  })

  it('handles setting a selected, unregistered item', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const setItemContainerUnregistered = screen.getByTestId(
      'setItemContainerUnregistered'
    )

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(setItemContainerUnregistered)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { location, ...restItem } = mockItem

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: {
        coordinates: mockLatLng,
        address: undefined,
      },
      Zork: {
        ...restItem,
        type: mockUNREGISTERED_TYPE,
      },
    })
  })

  it('handles removing a selected item', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(mockLatLng)
      .mockReturnValueOnce(undefined)

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const removeItemContainer = screen.getByTestId('removeItemContainer')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(removeItemContainer)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({
      location: {},
      Zork: undefined,
    })
  })

  it('handles setting a location, without having to fetch the address', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

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
        type: mockUNREGISTERED_TYPE,
      },
    })
  })
})
