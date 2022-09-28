// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import { get, mockUseMapInstance, useFetchResponse } from '../__test__'
import { IncidentMap } from './IncidentMap'

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  ...jest.requireActual('@amsterdam/react-maps'),
  useMapInstance: jest.fn(() => mockUseMapInstance),
}))

jest.mock('../FilterPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../FilterPanel'),
  FilterPanel: () => <div>[Filter Panel]</div>,
}))

jest.mock('hooks/useFetch')

describe('IncidentMap', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render the incident map correctly', () => {
    render(withAppContext(<IncidentMap />))

    expect(screen.getByTestId('incidentMap')).toBeInTheDocument()
    expect(screen.getByTestId('gpsButton')).toBeInTheDocument()
    expect(screen.getByText('Address Search Input')).toBeInTheDocument()
    expect(screen.getByText('[Filter Panel]')).toBeInTheDocument()
  })

  it('sends a request to fetch publicly available incidents', () => {
    render(withAppContext(<IncidentMap />))

    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
  })

  it('shows a message when the API returns an error', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      error: new Error(),
    }))

    render(withAppContext(<IncidentMap />))

    expect(
      screen.getByText('Er konden geen meldingen worden opgehaald.')
    ).toBeInTheDocument()
  })

  it('should close the error message when close button is clicked', () => {
    jest.mocked(useFetch).mockImplementationOnce(() => ({
      ...useFetchResponse,
      error: new Error(),
    }))

    render(withAppContext(<IncidentMap />))
    expect(
      screen.queryByText('Er konden geen meldingen worden opgehaald.')
    ).toBeInTheDocument()

    const closeButton = screen.getByTestId('closeMessage')

    expect(closeButton).toBeInTheDocument()

    userEvent.click(closeButton)

    expect(
      screen.queryByText('Er konden geen meldingen worden opgehaald.')
    ).not.toBeInTheDocument()
  })
})
