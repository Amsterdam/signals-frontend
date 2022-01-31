// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, act, fireEvent, waitFor } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import GPSButton from './GPSButton'

describe('components/GPSButton', () => {
  it('should render button with icon', () => {
    const { container, getByTestId } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={() => {}}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
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
            setTimeout(() => resolve(success({ coords })))
          )
      )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.geolocation = { getCurrentPosition }

    const onLocationSuccess = jest.fn()

    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation

    const onLocationSuccess = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
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

  it('should call onLocationError', () => {
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation

    const onLocationError = jest.fn()
    const onLocationSuccess = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={onLocationError}
          onLocationOutOfBounds={() => {}}
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation

    const onLocationOutOfBounds = jest.fn()
    const onLocationSuccess = jest.fn()

    const { getByTestId, rerender, unmount } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
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
          onLocationError={() => {}}
        />
      )
    )

    expect(onLocationOutOfBounds).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('gpsButton'))
    })

    expect(onLocationOutOfBounds).toHaveBeenCalled()
  })
})
