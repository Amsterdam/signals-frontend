// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { get, mockUseMapInstance, useFetchResponse } from '../__test__/utils'
import { IncidentMap } from './IncidentMap'

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
    expect(screen.getByTestId('filterCategoryPanel')).toBeInTheDocument()
  })

  it('sends a request to fetch publicly available categories and incidents', () => {
    expect(get).not.toHaveBeenCalled()

    render(withAppContext(<IncidentMap />))

    expect(get).toHaveBeenCalledTimes(2)
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.CATEGORIES_ENDPOINT)
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
