// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'

import { INPUT_DELAY } from 'components/AutoSuggest'
import * as actions from 'containers/MapContext/actions'
import context from 'containers/MapContext/context'
import { CLICK_TIMEOUT } from 'hooks/useDelayedDoubleClick'
import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { withAppContext, withMapContext } from 'test/utils'

import MapInput from '.'

jest.mock('containers/MapContext/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/MapContext/actions'),
  resetLocationAction: jest.fn(() => ({
    type: 'type',
  })),
  setLocationAction: jest.fn((payload) => ({
    type: 'type',
    payload,
  })),
  setValuesAction: jest.fn((payload) => ({
    type: 'type',
    payload,
  })),
}))

const setValuesSpy = jest.spyOn(actions, 'setValuesAction')
const setLocationSpy = jest.spyOn(actions, 'setLocationAction')
const resetLocationSpy = jest.spyOn(actions, 'resetLocationAction')

const geocoderResponse = {
  response: {
    numFound: 1,
    start: 0,
    maxScore: 15.822564,
    docs: [
      {
        woonplaatsnaam: 'Amsterdam',
        huis_nlt: '117',
        weergavenaam: 'Rozengracht 117, 1016LV Amsterdam',
        straatnaam_verkort: 'Rozengr',
        id: 'adr-b8200d39f3562a4ecac2f8371187df61',
        postcode: '1016LV',
        centroide_ll: 'POINT(4.87900903 52.37280796)',
      },
    ],
  },
}

describe('components/MapInput', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy')
  })

  afterEach(() => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(geocoderResponse))

    setValuesSpy.mockClear()
    setLocationSpy.mockClear()
    resetLocationSpy.mockClear()

    jest.useRealTimers()
  })

  const testLocation = {
    location: {
      lat: 52.36279769502027,
      lng: 4.796855450052992,
    },
  }

  it('should render the map and the autosuggest', () => {
    const { getByTestId } = render(
      withMapContext(
        <MapInput mapOptions={MAP_OPTIONS} value={testLocation} id="test" />
      )
    )

    expect(getByTestId('map-input')).toBeInTheDocument()
    expect(getByTestId('auto-suggest')).toBeInTheDocument()
  })

  it('should dispatch setValuesAction', () => {
    const { rerender } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={{}} id="test" />)
    )

    expect(setValuesSpy).not.toHaveBeenCalled()

    const value = { addressText: 'Foo', ...testLocation }

    rerender(
      withMapContext(
        <MapInput mapOptions={MAP_OPTIONS} value={value} id="test" />
      )
    )

    expect(setValuesSpy).toHaveBeenCalledTimes(1)
    expect(setValuesSpy).toHaveBeenCalledWith(value)

    rerender(
      withMapContext(
        <MapInput mapOptions={MAP_OPTIONS} value={testLocation} id="test" />
      )
    )

    expect(setValuesSpy).toHaveBeenCalledTimes(2)
    expect(setValuesSpy).toHaveBeenCalledWith(testLocation)

    setValuesSpy.mockClear()
    setLocationSpy.mockClear()

    rerender(
      withMapContext(
        <MapInput mapOptions={MAP_OPTIONS} value={testLocation} id="test" />
      )
    )

    expect(setValuesSpy).not.toHaveBeenCalled()
  })

  it('should handle click', async () => {
    const onChange = jest.fn()
    const { findByTestId } = render(
      withMapContext(
        <MapInput
          mapOptions={MAP_OPTIONS}
          value={testLocation}
          onChange={onChange}
          id="test"
        />
      )
    )

    const map = await findByTestId('map-input')

    expect(setLocationSpy).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    expect(setValuesSpy).toHaveBeenCalledTimes(1)

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 })
    })

    await findByTestId('map-input')

    expect(setLocationSpy).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    expect(setValuesSpy).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(CLICK_TIMEOUT)
    })

    await findByTestId('map-input')

    expect(setLocationSpy).toHaveBeenCalledTimes(1)
    expect(setLocationSpy).toHaveBeenCalledWith({
      lat: expect.any(Number),
      lng: expect.any(Number),
    })

    expect(setValuesSpy).toHaveBeenCalledTimes(2)
    expect(setValuesSpy).toHaveBeenLastCalledWith({
      addressText: expect.stringMatching(/.+/),
      address: expect.any(Object),
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({
      coordinates: expect.any(Object),
      address: expect.any(Object),
    })
  })

  it('should handle click when a location has no address', async () => {
    const onChange = jest.fn()
    const noneFoundResponse = {
      response: {
        numFound: 0,
        start: 0,
        maxScore: 0.0,
        docs: [],
      },
    }

    fetch.resetMocks()
    fetch
      .mockResponseOnce(JSON.stringify(noneFoundResponse))
      .mockResponseOnce(JSON.stringify(geocoderResponse))

    const { getByTestId, findByTestId } = render(
      withMapContext(
        <MapInput
          id="test"
          mapOptions={MAP_OPTIONS}
          value={testLocation}
          onChange={onChange}
        />
      )
    )
    const map = getByTestId('map-input')

    expect(setValuesSpy).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 })
    })

    await findByTestId('map-input')

    expect(setValuesSpy).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(CLICK_TIMEOUT)
    })

    await findByTestId('map-input')

    expect(setValuesSpy).toHaveBeenCalledTimes(2)
    expect(setValuesSpy).toHaveBeenLastCalledWith({
      addressText: '',
      address: '',
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({
      coordinates: expect.any(Object),
      address: undefined,
    })
  })

  it('should render marker and center the map', async () => {
    const coordinates = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    }

    const mapMoveSpy = jest.fn()

    const { container, findByTestId, rerender } = render(
      withAppContext(
        <context.Provider value={{ state: {}, dispatch: () => {} }}>
          <MapInput
            id="test"
            mapOptions={MAP_OPTIONS}
            value={testLocation}
            events={{
              movestart: mapMoveSpy,
            }}
          />
        </context.Provider>
      )
    )

    await findByTestId('map-input')

    expect(
      container.querySelector(`.${markerIcon.options.className}`)
    ).not.toBeInTheDocument()
    expect(mapMoveSpy).not.toHaveBeenCalled()

    rerender(
      withAppContext(
        <context.Provider
          value={{ state: { coordinates }, dispatch: () => {} }}
        >
          <MapInput
            id="test"
            mapOptions={MAP_OPTIONS}
            value={testLocation}
            events={{
              movestart: mapMoveSpy,
            }}
          />
        </context.Provider>
      )
    )

    await findByTestId('map-input')

    expect(
      container.querySelector(`.${markerIcon.options.className}`)
    ).toBeInTheDocument()
    expect(mapMoveSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle onSelect', async () => {
    const onChange = jest.fn()
    const { getByTestId, findByTestId } = render(
      withAppContext(
        <context.Provider
          value={{ state: { lat: 51, lng: 4 }, dispatch: () => {} }}
        >
          <MapInput
            id="test"
            mapOptions={MAP_OPTIONS}
            value={testLocation}
            onChange={onChange}
          />
        </context.Provider>
      )
    )

    // provide input with value
    const input = getByTestId('auto-suggest').querySelector('input')
    const value = 'Midden'

    act(() => {
      input.focus()
    })

    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(geocoderResponse))

    act(() => {
      fireEvent.change(input, { target: { value } })
    })

    const suggestList = await findByTestId('suggest-list')

    const firstElement = suggestList.querySelector('li:nth-of-type(1)')

    expect(setValuesSpy).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()

    // mock the geosearch response
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(geocoderResponse))

    // click option in list
    act(() => {
      fireEvent.click(firstElement)
    })

    await findByTestId('map-input')

    expect(setValuesSpy).toHaveBeenCalledTimes(2)
    expect(setValuesSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        coordinates: expect.any(Object),
        address: expect.any(Object),
        addressText: input.value,
      })
    )

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        coordinates: expect.any(Object),
        address: expect.any(Object),
      })
    )
  })

  it('should clear location and not render marker', async () => {
    const location = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    }
    const addressText = 'Foo bar street 10'

    const { findByTestId } = render(
      withAppContext(
        <context.Provider
          value={{ state: { location, addressText }, dispatch: () => {} }}
        >
          <MapInput id="test" mapOptions={MAP_OPTIONS} value={testLocation} />
        </context.Provider>
      )
    )
    const autoSuggest = await findByTestId('auto-suggest')
    const input = autoSuggest.querySelector('input')

    expect(resetLocationSpy).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(input, { target: { value: addressText } })
    })

    await findByTestId('auto-suggest')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    expect(resetLocationSpy).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(input, { target: { value: '' } })
    })

    await findByTestId('auto-suggest')

    expect(resetLocationSpy).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    expect(resetLocationSpy).toHaveBeenCalled()
  })
})
