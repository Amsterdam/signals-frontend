// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import keycloakJS, { KeycloakInstance } from 'keycloak-js'
import { mocked } from 'ts-jest/utils'

import Keycloak from './keycloak'

jest.mock('keycloak-js')
jest.mock('shared/services/configuration/configuration')

const keycloakJSMock = {
  login: jest.fn(),
  logout: jest.fn(),
  isTokenExpired: jest.fn(),
  updateToken: jest.fn(),
  init: jest.fn(),
  onAuthSuccess: jest.fn(),
} as unknown as KeycloakInstance

describe('Keycloak authorization', () => {
  beforeAll(() => {
    mocked(keycloakJS).mockImplementation(() => keycloakJSMock)

    configuration.oidc = {
      authEndpoint: 'https://example.nl/auth',
      clientId: 'frontend',
      realm: 'auth-realm',
    } as any
  })

  beforeEach(() => {
    mocked(keycloakJS).mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    it('instantiates listeners to start and stop refresh interval', () => {
      new Keycloak()

      expect(keycloakJSMock.onAuthSuccess).toBeDefined()
      expect(keycloakJSMock.onAuthRefreshError).toBeDefined()
      expect(keycloakJSMock.onAuthError).toBeDefined()
      expect(keycloakJSMock.onAuthLogout).toBeDefined()
      expect(keycloakJSMock.onTokenExpired).toBeDefined()
    })
  })

  describe('init', () => {
    it('calls keycloak-js init function', async () => {
      new Keycloak().init()

      expect(keycloakJSMock.init).toHaveBeenCalled()
    })

    it('calls keycloak-js init with check-sso when localstorage domain value is set', () => {
      new Keycloak().init()

      expect(keycloakJSMock.init).not.toHaveBeenCalledWith(
        expect.objectContaining({
          onLoad: 'check-sso',
        })
      )

      jest.spyOn(global.localStorage, 'getItem').mockReturnValueOnce('keycloak')

      new Keycloak().init()

      expect(keycloakJSMock.init).toHaveBeenLastCalledWith(
        expect.objectContaining({
          onLoad: 'check-sso',
        })
      )
    })
  })

  describe('login', () => {
    it('calls keycloak-js login function', async () => {
      new Keycloak().login()

      expect(keycloakJSMock.login).toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('calls keycloak-js logout function', async () => {
      new Keycloak().logout()

      expect(keycloakJSMock.logout).toHaveBeenCalled()
    })
  })

  describe('getIsAuthenticated', () => {
    it('returns true if user is authenticated', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          authenticated: true,
          isTokenExpired: () => false,
        })
      )

      expect(new Keycloak().getIsAuthenticated()).toBe(true)
    })

    it('returns false if user is not authenticaed is expired', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          authenticated: false,
        })
      )

      expect(new Keycloak().getIsAuthenticated()).toBe(false)
    })

    it('returns false if token is expired', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          authenticated: true,
          isTokenExpired: () => false,
        })
      )

      expect(new Keycloak().getIsAuthenticated()).toBe(true)
    })
  })

  describe('getAccessToken', () => {
    it('returns keycloak access token', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          token: 'foo',
        })
      )

      expect(new Keycloak().getAccessToken()).toBe('foo')
    })
  })

  describe('getAuthHeaders', () => {
    it('returns auth headers', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          token: 'bar',
        })
      )

      expect(new Keycloak().getAuthHeaders()).toEqual({
        Authorization: 'Bearer bar',
      })
    })

    it('returns empty object if there is no auth token', () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          token: null,
        })
      )

      expect(new Keycloak().getAuthHeaders()).toEqual({})
    })
  })

  describe('authenticate', () => {
    it('returns data when authenticated', async () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          authenticated: true,
          isTokenExpired: () => false,
          token: 'foo',
          init: jest.fn().mockResolvedValue(true),
        })
      )

      const result = await new Keycloak().authenticate()

      expect(result).toEqual({ accessToken: 'foo' })
    })

    it('returns null when not authenticated', async () => {
      mocked(keycloakJS).mockImplementation(() =>
        Object.assign({}, keycloakJSMock, {
          authenticated: false,
          init: jest.fn().mockResolvedValue(true),
        })
      )

      const result = await new Keycloak().authenticate()

      expect(result).toEqual(null)
    })
  })

  describe('startRefreshInterval', () => {
    it('starts interval that calls keycloak-js updateToken function', () => {
      jest.useFakeTimers()

      new Keycloak().startRefreshInterval()

      expect(keycloakJSMock.updateToken).not.toHaveBeenCalled()
      jest.advanceTimersToNextTimer()
      expect(keycloakJSMock.updateToken).toHaveBeenCalled()

      jest.clearAllTimers()
      jest.useRealTimers()
    })
  })

  describe('stopRefreshInterval', () => {
    it('removes refresh interval stored in keycloak instance', () => {
      window.clearInterval = jest.fn()

      const keycloak = new Keycloak()

      keycloak.startRefreshInterval()
      expect(window.clearInterval).not.toHaveBeenCalled()
      keycloak.stopRefreshInterval()
      expect(window.clearInterval).toHaveBeenCalled()
    })
  })
})
