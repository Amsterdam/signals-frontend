// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, act, fireEvent, waitFor } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import GPSButton from '..'

describe('components/GPSButton', () => {
  it('should render button with icon', () => {
    const { container, getByTestId } = render(
      withAppContext(<GPSButton onLocationSuccess={() => {}} />)
    )

    const button = getByTestId('gpsButton')

    expect(button.nodeName).toEqual('BUTTON')
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should render the loadingIndicator', async () => {
    const coords = {
      accuracy: 123,
      latitude: 52,
      longitude: 4,
    }
    const getCurrentPosition = jest
      .fn()
      .mockImplementation(
        (success) =>
          new Promise((resolve) =>
            setTimeout(() => resolve(success({ coords }), 0))
          )
      )

    global.navigator.geolocation = { getCurrentPosition }

    const onLocationSuccess = jest.fn()

    const { getByTestId, queryByTestId } = render(
      withAppContext(<GPSButton onLocationSuccess={onLocationSuccess} />)
    )

    expect(getCurrentPosition).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(getByTestId('loadingIndicator')).toBeInTheDocument()

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    await waitFor(
      () => expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument(),
      { timeout: 10 }
    )
  })

  it('should call onLocationSuccess', () => {
    const coords = {
      accuracy: 1234,
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

    global.navigator.geolocation = mockGeolocation

    const onLocationSuccess = jest.fn()

    const { getByTestId } = render(
      withAppContext(<GPSButton onLocationSuccess={onLocationSuccess} />)
    )

    expect(onLocationSuccess).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationSuccess).toHaveBeenCalledWith({
      ...coords,
      toggled: true,
    })

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationSuccess).toHaveBeenLastCalledWith({
      toggled: false,
    })
  })

  it('should call onLocationChange', () => {
    const coords = {
      accuracy: 1234,
      latitude: 52.3731081,
      longitude: 4.8932945,
    }
    const mockGeolocation = {
      watchPosition: jest.fn().mockImplementation((success) =>
        Promise.resolve(
          success({
            coords,
          })
        )
      ),
    }

    global.navigator.geolocation = mockGeolocation

    const onLocationChange = jest.fn()

    const { getByTestId } = render(
      withAppContext(<GPSButton onLocationChange={onLocationChange} />)
    )

    expect(onLocationChange).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationChange).toHaveBeenCalledWith({
      ...coords,
      toggled: true,
    })

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationChange).toHaveBeenLastCalledWith({
      toggled: false,
    })
  })

  it('should call onLocationError', () => {
    const code = 1
    const message = 'User denied geolocation'
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) =>
        Promise.resolve(
          error({
            code,
            message,
          })
        )
      ),
    }

    global.navigator.geolocation = mockGeolocation

    const onLocationError = jest.fn()
    const onLocationSuccess = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={onLocationError}
        />
      )
    )

    expect(onLocationError).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationError).toHaveBeenCalledWith({
      code,
      message,
    })
  })

  it('should call onLocationOutOfBounds', () => {
    const coords = {
      accuracy: 1234,
      latitude: 55,
      longitude: 5,
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

    global.navigator.geolocation = mockGeolocation

    const onLocationOutOfBounds = jest.fn()
    const onLocationSuccess = jest.fn()

    const { getByTestId, rerender, unmount } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationOutOfBounds={null}
        />
      )
    )

    expect(onLocationOutOfBounds).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationOutOfBounds).not.toHaveBeenCalled()

    unmount()

    rerender(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationOutOfBounds={onLocationOutOfBounds}
        />
      )
    )

    expect(onLocationOutOfBounds).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationOutOfBounds).toHaveBeenCalled()
  })

  it('should throw an error', () => {
    global.console.error = jest.fn()

    expect(() => {
      render(withAppContext(<GPSButton />))
    }).toThrow()

    expect(() => {
      render(withAppContext(<GPSButton onLocationSuccess={null} />))
    }).toThrow()

    expect(() => {
      render(withAppContext(<GPSButton onLocationChange={() => {}} />))
    }).not.toThrow()

    global.console.error.mockRestore()
  })
})
