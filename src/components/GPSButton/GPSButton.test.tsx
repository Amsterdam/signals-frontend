// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'

import GPSButton from './GPSButton'

describe('components/GPSButton', () => {
  it('should render button with icon', () => {
    render(
      withAppContext(
        <GPSButton
          onLocationSuccess={() => {}}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
    )

    const button = screen.getByTestId('gpsButton')

    expect(button.nodeName).toEqual('BUTTON')
    expect(document.querySelector('svg')).toBeInTheDocument()
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

    render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
    )

    expect(getCurrentPosition).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('gpsButton'))

    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    userEvent.click(screen.getByTestId('gpsButton'))

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    await waitFor(
      () =>
        expect(
          screen.queryByTestId('loadingIndicator')
        ).not.toBeInTheDocument(),
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

    render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
    )

    expect(onLocationSuccess).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('gpsButton'))

    expect(onLocationSuccess).toHaveBeenCalledWith(coords)
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

    render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={onLocationError}
          onLocationOutOfBounds={() => {}}
        />
      )
    )

    expect(onLocationError).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('gpsButton'))

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

    const { rerender, unmount } = render(
      withAppContext(
        <GPSButton
          onLocationSuccess={onLocationSuccess}
          onLocationError={() => {}}
          onLocationOutOfBounds={() => {}}
        />
      )
    )

    expect(onLocationOutOfBounds).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('gpsButton'))

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

    userEvent.click(screen.getByTestId('gpsButton'))

    expect(onLocationOutOfBounds).toHaveBeenCalled()
  })
})
