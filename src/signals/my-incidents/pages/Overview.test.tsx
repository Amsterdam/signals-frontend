// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import useFetch from '../../../hooks/useFetch'
import { providerMock } from '../__test__'
import { MyIncidentsProvider } from '../context'
import { Overview } from './Overview'

jest.mock('../components', () => ({
  __esModule: true,
  ...jest.requireActual('../components'),
  IncidentsList: () => <div>[IncidentsList]</div>,
}))

Object.defineProperty(window, 'location', {
  value: {
    pathname: 'http://www.mijnmeldingen.nl/mijn-meldingen/123kjsbef',
  },
})

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

describe('Overview', () => {
  it('should render correctly', async () => {
    const response = {
      ...useFetchResponse,
      data: {
        email: 'test@test.nl',
      },
    }
    jest.mocked(useFetch).mockImplementation(() => response)

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Overview />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Mijn meldingen')).toBeInTheDocument()
    expect(screen.getByText('test@test.nl')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Dit zijn de meldingen die u de afgelopen 12 maanden heeft gemaakt:'
      )
    ).toBeInTheDocument()
  })

  it('should fetch email when not provided', async () => {
    const response = {
      ...useFetchResponse,
      data: {
        email: 'test@test.nl',
      },
    }
    jest.mocked(useFetch).mockImplementation(() => response)
    const providerMockNoEmail = {
      ...providerMock,
      email: '',
    }

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMockNoEmail}>
          <Overview />
        </MyIncidentsProvider>
      )
    )

    expect(get).toBeCalledWith(
      'http://localhost:8000/signals/v1/my/signals/me',
      {},
      {},
      { Authorization: 'Token 123kjsbef' }
    )
  })
})
