// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import {
  mockRequestHandler,
  fetchMock,
} from '../../../internals/testing/msw-server'
import { useCheckApiHealth } from '../useApiHealthCheck'

jest.spyOn(global.document, 'dispatchEvent')

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/some-path',
    search: '',
    state: null,
  }),
}))

fetchMock.disableMocks()

const mockNavigate = jest.fn()
const useNavigateSpy = jest.spyOn(reactRouterDom, 'useNavigate')
useNavigateSpy.mockImplementation(() => mockNavigate)

const renderhookOptions = {
  wrapper: ({ children }: any) => withAppContext(children),
}

describe('useCheckApiHealth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to /onderhoud when API returns 503', async () => {
    mockRequestHandler({
      status: 503,
      url: `${configuration.apiBaseUrl}/signals/`,
      method: 'head',
      body: null,
    })

    renderHook(() => useCheckApiHealth(), renderhookOptions)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/onderhoud')
    })
  })

  it('should not navigate to /onderhoud when already on maintenance page', async () => {
    mockRequestHandler({
      status: 503,
      url: `${configuration.apiBaseUrl}/signals/`,
      method: 'head',
      body: null,
    })
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/onderhoud',
      search: '',
      state: null,
    }))
    renderHook(() => useCheckApiHealth(), renderhookOptions)

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/onderhoud')
    })
  })
})
