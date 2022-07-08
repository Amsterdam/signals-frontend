// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { mocked } from 'jest-mock'
import { getAuthHeaders } from '../auth/auth'
import fileUploadChannel from '.'

jest.mock('../auth/auth')

const mockGetAuthHeaders = mocked(getAuthHeaders)

describe('The file upload channel service', () => {
  let addEventListener
  let removeEventListener
  let abort
  let open
  let send
  let setRequestHeader

  beforeEach(() => {
    addEventListener = jest.fn()
    removeEventListener = jest.fn()
    abort = jest.fn()
    open = jest.fn()
    send = jest.fn()
    setRequestHeader = jest.fn()

    window.XMLHttpRequest = jest.fn()
    window.XMLHttpRequest.mockImplementation(() => ({
      abort,
      open,
      send,
      setRequestHeader,
      upload: {
        addEventListener,
        removeEventListener,
      },
    }))
  })

  afterEach(() => {})

  it('should map status by default', () => {
    mockGetAuthHeaders.mockImplementation(() => ({}))

    const channel = fileUploadChannel(
      'https://acc.api.data.amsterdam.nl/signals/signal/image/',
      'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c',
      666
    )

    expect(open).toHaveBeenCalledWith(
      'POST',
      'https://acc.api.data.amsterdam.nl/signals/signal/image/',
      true
    )
    expect(setRequestHeader).not.toHaveBeenCalled()
    expect(send).toHaveBeenCalledWith(expect.any(Object))

    expect(addEventListener).toHaveBeenCalledWith(
      'progress',
      expect.any(Function)
    )
    expect(addEventListener).toHaveBeenCalledWith('error', expect.any(Function))
    expect(addEventListener).toHaveBeenCalledWith('abort', expect.any(Function))

    channel.close()

    expect(removeEventListener).toHaveBeenCalledWith(
      'progress',
      expect.any(Function)
    )
    expect(removeEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    )
    expect(removeEventListener).toHaveBeenCalledWith(
      'abort',
      expect.any(Function)
    )

    expect(abort).toHaveBeenCalledWith()
  })

  it('should pass auth headers', () => {
    const authKey = 'Authorization'
    const authValue = 'Bearer token'
    const authHeader = { [authKey]: authValue }
    mockGetAuthHeaders.mockImplementation(() => authHeader)

    const channel = fileUploadChannel(
      'https://acc.api.data.amsterdam.nl/signals/signal/image/',
      'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c',
      666
    )

    expect(setRequestHeader).toHaveBeenCalledWith(authKey, authValue)

    channel.close()
  })
})
