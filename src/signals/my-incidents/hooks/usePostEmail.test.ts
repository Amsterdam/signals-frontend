import { act, renderHook } from '@testing-library/react'

import useFetch from 'hooks/useFetch'
import type { FetchError } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

import { usePostEmail } from './usePostEmail'

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
const URL = `${configuration.MY_SIGNALS_LOGIN_URL}`

describe('usePostEmail', () => {
  it('should post email', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    const { result } = renderHook(usePostEmail)

    const [postEmail] = result.current

    expect(post).not.toHaveBeenCalled()

    act(() => postEmail('test@email.com'))

    expect(post).toHaveBeenCalledWith(URL, { email: 'test@email.com' })
  })

  it('should set error message when too many requests', () => {
    const error = { status: 429, message: 'Too many requests' } as FetchError
    const response = {
      ...useFetchResponse,
      error,
    }
    jest.mocked(useFetch).mockImplementation(() => response)

    const { result } = renderHook(usePostEmail)

    const [postEmail] = result.current

    act(() => postEmail('test@email.com'))

    const [, { errorMessage }] = result.current

    expect(errorMessage).toEqual(
      `U hebt te vaak gevraagd om de e-mail opnieuw te versturen. Over 20 minuten kunt u het opnieuw proberen.`
    )
  })
})
