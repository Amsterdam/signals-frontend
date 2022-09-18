/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'

import { ZoomToGPSLocation } from './ZoomToGPSLocation'
import type { Props } from './ZoomToGPSLocation'
import userEvent from '@testing-library/user-event'

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('@amsterdam/react-maps')!,
  Marker: ({ ...Props }) => {
    return <div {...Props}></div>
  },
}))

const defaultProps: Props = {
  flyTo: jest.fn(),
  setNotification: jest.fn(),
}

describe('ZoomToGPSLocation', () => {
  it('renders the component', () => {
    render(<ZoomToGPSLocation {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: 'Huidige locatie' })
    ).toBeInTheDocument()
  })
  it('flies to the location on click', () => {
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

    render(<ZoomToGPSLocation {...defaultProps} />)

    userEvent.click(screen.getByRole('button', { name: 'Huidige locatie' }))

    expect(defaultProps.flyTo).toHaveBeenCalled()
  })

  it('shows marker when coordinates are available', () => {
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

    render(<ZoomToGPSLocation {...defaultProps} />)

    expect(screen.queryByTestId('incidentPinMarker')).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: 'Huidige locatie' }))

    expect(screen.queryByTestId('incidentPinMarker')).toBeInTheDocument()
  })
})
