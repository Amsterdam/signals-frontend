// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import IncidentMap from './IncidentMap'
import { get, mockUseMapInstance, useFetchResponse } from './mapTestUtils'

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  ...jest.requireActual('@amsterdam/react-maps'),
  useMapInstance: jest.fn(() => mockUseMapInstance),
}))

jest.mock('hooks/useFetch')

describe('<IncidentMap />', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render the incident map correctly', () => {
    render(withAppContext(<IncidentMap />))

    expect(screen.getByTestId('incidentMap')).toBeInTheDocument()
    expect(screen.getByTestId('incidentLayer')).toBeInTheDocument()
    expect(screen.getByTestId('mapZoom')).toBeInTheDocument()
  })

  it('sends a request to fetch public incidents', () => {
    expect(get).not.toHaveBeenCalled()

    render(withAppContext(<IncidentMap />))

    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
  })

  it('shows a message when the API returns an error', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: undefined,
      error: true,
    }))

    render(withAppContext(<IncidentMap />))

    expect(
      screen.getByText('Er konden geen meldingen worden opgehaald.')
    ).toBeInTheDocument()
  })
})
