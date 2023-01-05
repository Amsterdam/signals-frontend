// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useFetch from '../../../hooks/useFetch'
import { history, withAppContext } from '../../../test/utils'
import { get, useFetchResponse } from '../../IncidentMap/components/__test__'
import { providerMock } from '../__test__'
import { incidentsDetail } from '../__test__/incidents-detail'
import { MyIncidentsProvider } from '../context'
import { Detail } from './Detail'

jest.mock('../hooks', () => {
  const actual = jest.requireActual('../hooks')
  return {
    __esModule: true,
    ...actual,
    usePostEmail: () => [jest.fn(), 'rest'],
  }
})

jest.mock('../components/History/History', () => ({
  __esModule: true,
  ...jest.requireActual('../components/History/History'),
  History: () => <div>[History]</div>,
}))

jest.mock('hooks/useFetch')

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'http://www.mijnmeldingen.nl/mijn-meldingen/123/123',
  }),
}))

describe('Detail', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render correctly and show map', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: incidentsDetail,
    }))

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Detail />
        </MyIncidentsProvider>
      )
    )

    userEvent.click(screen.getByText('Bekijk op kaart'))

    expect(screen.queryByTestId('map-detail')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('close-button'))

    expect(screen.getByText('Bekijk op kaart')).toBeInTheDocument()
  })
  it('should redirect to the expired page when an error is thrown', () => {
    const response = {
      ...useFetchResponse,
      error: true,
    }
    jest.mocked(useFetch).mockImplementation(() => response)

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Detail />
        </MyIncidentsProvider>
      )
    )

    expect(history.location.pathname).toEqual('/mijn-meldingen/verlopen')
  })
})
