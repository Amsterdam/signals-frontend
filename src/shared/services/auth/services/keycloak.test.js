// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import parseAccessToken from './parse-access-token/parse-access-token'

import Keycloak from './keycloak'

jest.mock('./parse-access-token/parse-access-token')
jest.mock('shared/services/configuration/configuration')

describe('Keycloak authorization', () => {
  const keycloak = new Keycloak()
  beforeEach(() => {
    configuration.keycloak = {
      authEndpoint: 'https://example.nl/auth',
      clientId: 'frontend',
      responseType: 'code',
      realm: 'auth-realm',
    }
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('keycloak', () => {
    describe('constructor', () => {
      it('should initialize keycloak-js', () => {
        expect(keycloak.keycloak).toBeDefined()
        expect(keycloak.refreshIntervalId).toBeNull()
      })

      it('instantiates listeners to start and stop refresh interval', () => {
        const startRefreshIntervalSpy = jest.spyOn(
          keycloak,
          'startRefreshInterval'
        )
        const stopRefreshIntervalSpy = jest.spyOn(
          keycloak,
          'stopRefreshInterval'
        )

        keycloak.keycloak.onAuthSuccess()
        expect(startRefreshIntervalSpy).toHaveBeenCalledTimes(1)
        expect(stopRefreshIntervalSpy).toHaveBeenCalledTimes(0)

        startRefreshIntervalSpy.mockReset()
        stopRefreshIntervalSpy.mockReset()

        keycloak.keycloak.onAuthRefreshError()
        expect(startRefreshIntervalSpy).toHaveBeenCalledTimes(0)
        expect(stopRefreshIntervalSpy).toHaveBeenCalledTimes(1)

        startRefreshIntervalSpy.mockReset()
        stopRefreshIntervalSpy.mockReset()

        keycloak.keycloak.onAuthLogout()
        expect(startRefreshIntervalSpy).toHaveBeenCalledTimes(0)
        expect(stopRefreshIntervalSpy).toHaveBeenCalledTimes(1)

        startRefreshIntervalSpy.mockReset()
        stopRefreshIntervalSpy.mockReset()

        keycloak.keycloak.onAuthError()
        expect(startRefreshIntervalSpy).toHaveBeenCalledTimes(0)
        expect(stopRefreshIntervalSpy).toHaveBeenCalledTimes(1)

        startRefreshIntervalSpy.mockReset()
        stopRefreshIntervalSpy.mockReset()

        const logoutSpy = jest
          .spyOn(keycloak.keycloak, 'logout')
          .mockReturnValue()
        keycloak.keycloak.onTokenExpired()
        expect(startRefreshIntervalSpy).toHaveBeenCalledTimes(0)
        expect(stopRefreshIntervalSpy).toHaveBeenCalledTimes(1)
        expect(logoutSpy).toHaveBeenCalledTimes(1)
      })
    })
    describe('init', () => {
      it('calls keycloak-js init function', () => {
        // suppress console error because of unimplemented navigation in JSDOM
        // @see {@link https://github.com/jsdom/jsdom/issues/2112}
        global.window.console.error = jest.fn()

        const initSpy = jest.spyOn(keycloak.keycloak, 'init')

        keycloak.init()

        global.window.console.error.mockRestore()

        expect(initSpy).toHaveBeenCalled()
      })
    })

    describe('login', () => {
      it('calls keycloak-js login function', async () => {
        keycloak.isInitialized = false
        const initSpy = jest
          .spyOn(keycloak.keycloak, 'init')
          .mockResolvedValue()
        const loginSpy = jest
          .spyOn(keycloak.keycloak, 'login')
          .mockImplementation(() => {})

        await keycloak.login()

        expect(initSpy).toHaveBeenCalled()
        expect(loginSpy).toHaveBeenCalled()
      })
    })

    describe('logout', () => {
      it('calls keycloak-js logout function', () => {
        const logoutSpy = jest
          .spyOn(keycloak.keycloak, 'logout')
          .mockReturnValue()

        keycloak.logout()

        expect(logoutSpy).toHaveBeenCalled()
      })
    })

    describe('isAuthenticated', () => {
      it('returns true if user is authenticated', () => {
        keycloak.keycloak.authenticated = true
        const isTokenExpiredMock = jest
          .spyOn(keycloak.keycloak, 'isTokenExpired')
          .mockReturnValue(false)

        expect(keycloak.isAuthenticated()).toBe(true)
        expect(isTokenExpiredMock).toHaveBeenCalledTimes(1)
      })

      it('returns false if token is expired', () => {
        keycloak.keycloak.authenticated = true
        const isTokenExpiredMock = jest
          .spyOn(keycloak.keycloak, 'isTokenExpired')
          .mockReturnValue(true)

        expect(keycloak.isAuthenticated()).toBe(false)
        expect(isTokenExpiredMock).toHaveBeenCalledTimes(1)
      })

      it('returns true if user is authenticated', () => {
        keycloak.keycloak.authenticated = true
        const isTokenExpiredMock = jest
          .spyOn(keycloak.keycloak, 'isTokenExpired')
          .mockReturnValue(false)

        expect(keycloak.isAuthenticated()).toBe(true)
        expect(isTokenExpiredMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('getAccessToken', () => {
      it('returns keycloak access token', () => {
        keycloak.keycloak.token = '123AccessToken'

        expect(keycloak.getAccessToken()).toBe('123AccessToken')
      })
    })

    describe('getAuthHeaders', () => {
      it('returns auth headers', () => {
        keycloak.keycloak.token = '123AccessTokenForAuthHeaders'

        expect(keycloak.getAuthHeaders()).toStrictEqual({
          Authorization: 'Bearer 123AccessTokenForAuthHeaders',
        })
      })

      it('returns empty object if there is no auth token', () => {
        keycloak.keycloak.token = null

        expect(keycloak.getAuthHeaders()).toStrictEqual({})
      })
    })

    describe('authenticate', () => {
      it('returns data when authenticated', async () => {
        keycloak.isInitialized = false
        keycloak.keycloak.isTokenExpired = jest.fn().mockReturnValue(false)
        keycloak.keycloak.init = jest.fn()
        keycloak.keycloak.authenticated = true
        keycloak.keycloak.token = '123AccessToken'

        parseAccessToken.mockImplementation(() => ({
          name: 'Jan Klaasen',
          scopes: 'openid profile email',
        }))

        expect(await keycloak.authenticate()).toEqual({
          accessToken: '123AccessToken',
          userName: 'Jan Klaasen',
          userScopes: 'openid profile email',
        })
      })

      it('returns null when not authenticated', async () => {
        keycloak.keycloak.init = jest.fn()
        keycloak.keycloak.authenticated = false

        expect(await keycloak.authenticate()).toEqual(null)
      })
    })

    describe('startRefreshInterval', () => {
      it('starts interval that calls keycloak-js updateToken function', () => {
        const updateTokenSpy = jest
          .spyOn(keycloak.keycloak, 'updateToken')
          .mockImplementation(() => {})
        expect(updateTokenSpy).not.toHaveBeenCalled()

        keycloak.startRefreshInterval()

        expect(updateTokenSpy).not.toHaveBeenCalled()

        jest.advanceTimersToNextTimer()

        expect(updateTokenSpy).toHaveBeenCalled()

        jest.clearAllTimers()
      })
    })

    describe('stopRefreshInterval', () => {
      it('removes refresh interval stored in keycloak instance', () => {
        keycloak.startRefreshInterval()
        keycloak.stopRefreshInterval()

        expect(clearInterval).toHaveBeenCalled()
      })
    })
  })
})
