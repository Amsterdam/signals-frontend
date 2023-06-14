// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext, history } from 'test/utils'

import { LoginForm } from './LoginForm'
import { useFetch } from '../../../../hooks'
import { providerMock } from '../../__test__'
import { MyIncidentsProvider } from '../../context'

const setErrorMessageMock = jest.fn()
jest.mock('hooks/useFetch')

const del = jest.fn()
const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()
const put = jest.fn()

const useFetchResponse = {
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

describe('LoginForm', () => {
  beforeEach(() => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
    }))
  })

  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <LoginForm setErrorMessage={setErrorMessageMock} />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('E-mailadres')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inloggen' })).toBeInTheDocument()
  })

  it('should submit email when submitting', async () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      isSuccess: true,
    }))

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <LoginForm setErrorMessage={setErrorMessageMock} />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox')

    userEvent.type(input, 'test@email.com')

    expect(screen.getByRole('textbox')).toHaveValue('test@email.com')

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    await waitFor(() => {
      userEvent.click(submitButton)
    })

    expect(providerMock.setEmail).toHaveBeenCalledWith('test@email.com')
    expect(history.location.pathname).toEqual('/bevestig')
  })

  it('should display a form error when email is invalid', async () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <LoginForm setErrorMessage={setErrorMessageMock} />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox')

    userEvent.type(input, 'myemail')

    expect(screen.getByRole('textbox')).toHaveValue('myemail')

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    await waitFor(() => {
      userEvent.click(submitButton)
    })

    expect(
      screen.getByText('Het veld moet een geldig e-mailadres bevatten')
    ).toBeInTheDocument()

    await waitFor(() => {
      userEvent.type(input, '@email.com')
    })

    expect(screen.getByRole('textbox')).toHaveValue('myemail@email.com')
    expect(
      screen.queryByText('Het veld moet een geldig e-mailadres bevatten')
    ).not.toBeInTheDocument()
  })

  it('should mock useFetch with isSuccess false and errorMessage true and call setErrorMessage', async () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      isSuccess: false,
      error: { status: 400, name: 'Bad request', message: 'Bad request' },
    }))

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <LoginForm setErrorMessage={setErrorMessageMock} />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox')

    await waitFor(() => {
      userEvent.type(input, 'user@email.com')
    })

    expect(setErrorMessageMock).toHaveBeenCalledWith(
      'Het inloggen is mislukt. Probeer het later opnieuw.'
    )
  })
})
