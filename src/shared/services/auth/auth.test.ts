// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { mocked } from 'jest-mock'

import configuration from 'shared/services/configuration/configuration'

import * as auth from './auth'
import ImplicitAuth from './services/implicit-auth'
import Keycloak from './services/keycloak-auth'

jest.mock('./services/keycloak-auth', () => jest.fn())
jest.mock('./services/implicit-auth', () =>
  jest.fn().mockImplementation(() => {
    return {
      getAccessToken: jest.fn().mockReturnValue('accessToken'),
      getAuthHeaders: jest.fn().mockReturnValue('authHeaders'),
      authenticate: jest.fn().mockResolvedValue('authenticated'),
      login: jest.fn().mockReturnValue('loggedIn'),
      logout: jest.fn().mockReturnValue('loggedOut'),
    }
  })
)

describe('Auth', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('uses ImplicitAuth implementation when realm is not configured', async () => {
    expect(auth).toBeDefined()
    expect((configuration.oidc as any).realm).not.toBeDefined()

    expect(mocked(ImplicitAuth)).toHaveBeenCalled()
    expect(mocked(Keycloak)).not.toHaveBeenCalled()
  })

  it('uses Keycloak implementation when (Keycloak) realm is configured and responseType is code', () => {
    jest.isolateModules(() => {
      jest.mock('shared/services/configuration/configuration', () => ({
        oidc: {
          realm: 'keycloak-realm',
          responseType: 'code',
        },
      }))
      const auth = require('./auth')

      expect(auth).toBeDefined()

      expect(mocked(ImplicitAuth)).not.toHaveBeenCalled()
      expect(mocked(Keycloak)).toHaveBeenCalled()
    })
  })

  it('uses DummyAuth as fallback when both sessionStorage and localStorage are not available', () => {
    jest.isolateModules(() => {
      jest.clearAllMocks()
      jest.mock('./services/dummy-auth', () => jest.fn())
      const IsolatedMockDummyAuth = require('./services/dummy-auth')
      const localStorage = window.localStorage
      const sessionStorage = window.sessionStorage

      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true,
      })
      Object.defineProperty(window, 'sessionStorage', {
        value: null,
        writable: true,
      })

      require('./auth')

      expect(mocked(ImplicitAuth)).not.toHaveBeenCalled()
      expect(mocked(Keycloak)).not.toHaveBeenCalled()
      expect(mocked(IsolatedMockDummyAuth)).toHaveBeenCalled()

      Object.defineProperty(window, 'localStorage', {
        value: localStorage,
        writable: false,
      })
      Object.defineProperty(window, 'sessionStorage', {
        value: sessionStorage,
        writable: false,
      })
    })
  })

  describe('getAuthHeaders', () => {
    it('calls getAuthHeaders function on auth instance', () => {
      expect(auth.getAuthHeaders()).toBe('authHeaders')
    })
  })

  describe('authenticate', () => {
    it('calls getAuthHeaders function on auth instance', async () => {
      await expect(auth.authenticate()).resolves.toBe('authenticated')
    })
  })

  describe('login', () => {
    it('calls login function on auth instance', () => {
      expect(auth.login()).toBe('loggedIn')
    })
  })

  describe('logout', () => {
    it('calls logout function on auth instance', () => {
      expect(auth.logout()).toBe('loggedOut')
    })
  })
})
