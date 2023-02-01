/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { screen, render } from '@testing-library/react'

import { history, withAppContext } from 'test/utils'

import { IncidentsList } from './IncidentsList'
import useFetch from '../../../../hooks/useFetch'
import { providerMock } from '../../__test__'
import { incidentsList as incidentsListMock } from '../../__test__/incidents-list'
import { MyIncidentsProvider } from '../../context'

jest.mock('hooks/useFetch')

export const del = jest.fn()
export const get = jest.fn()
export const patch = jest.fn()
export const post = jest.fn()
export const put = jest.fn()

export const useFetchResponse = {
  del,
  get,
  patch,
  post,
  put,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}

describe('IncidentsList', () => {
  it('should fetch data based on a token and render list', async () => {
    const response = {
      ...useFetchResponse,
      data: {
        results: incidentsListMock,
      },
    }
    jest.mocked(useFetch).mockImplementation(() => response)

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <IncidentsList token={'7535575b86bc9829e66ef22925a065412857ebd1'} />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Alles is kapot')).toBeInTheDocument()
    expect(screen.getByText('SIG-11656')).toBeInTheDocument()
    expect(screen.getByText('10 oktober 2022, 10.45 uur')).toBeInTheDocument()
    expect(screen.getByText('Status: afgesloten')).toBeInTheDocument()

    const links = screen.queryAllByRole('link', { name: 'Bekijk melding' })

    expect(links.length).toEqual(5)

    expect(screen.getByText('SIG-11620')).toBeInTheDocument()
    expect(screen.getByText('Telefoon kapot')).toBeInTheDocument()
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
          <IncidentsList token={'4321-invalid-token'} />
        </MyIncidentsProvider>
      )
    )

    expect(history.location.pathname).toEqual('/mijn-meldingen/verlopen')
  })

  it('should return null when incidentList is not available', () => {
    const response = {
      ...useFetchResponse,
      data: {
        results: undefined,
      },
    }
    jest.mocked(useFetch).mockImplementation(() => response)

    const { container } = render(
      withAppContext(
        <MyIncidentsProvider
          value={{
            ...providerMock,
            incidentsList: undefined,
          }}
        >
          <IncidentsList token={'7535575b86bc9829e66ef22925a065412857ebd1'} />
        </MyIncidentsProvider>
      )
    )

    expect(container.firstChild).toEqual(null)
  })
})
