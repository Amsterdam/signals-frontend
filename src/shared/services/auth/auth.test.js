// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import {
  getOauthDomain,
  getAuth,
  getAccessToken,
  isAuthenticated,
  getAuthHeaders,
  authenticate,
  login,
  logout,
} from './auth'
import Keycloak from './services/keycloak'
import Authz from './services/authz'

jest.mock('shared/services/configuration/configuration')

describe('auth', () => {
  let keycloak
  let authz
  let savedOauthDomain

  beforeEach(() => {
    keycloak = new Keycloak()
    authz = new Authz()
    global.localStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'oauthDomain':
          return savedOauthDomain
        default:
          return ''
      }
    })
  })

  afterEach(() => {
    configuration.__reset()
    global.localStorage.setItem.mockReset()
    global.localStorage.removeItem.mockReset()
    jest.restoreAllMocks()
  })

  describe('getOauthDomain', () => {
    it('returns current oAuthDomain', () => {
      savedOauthDomain = 'datapunt'
      const oauthDomain = getOauthDomain()

      expect(oauthDomain).toEqual('datapunt')
    })
  })

  describe('getAuth', () => {
    it('returns keycloak instance when keycloak is the current oAuth domain', () => {
      savedOauthDomain = 'keycloak'
      configuration.keycloak = {}

      expect(getAuth()).toBeInstanceOf(Keycloak)
    })

    it('returns authz instance when current oAuth domain is not keycloak', () => {
      savedOauthDomain = 'other'

      expect(getAuth()).toBeInstanceOf(Authz)
    })

    it('returns authz instance when current oAuth domain is not set', () => {
      savedOauthDomain = null

      expect(getAuth()).toBeInstanceOf(Authz)
    })

    it('returns authz instance when keycloak is not configured', () => {
      delete configuration.keycloak
      savedOauthDomain = 'keycloak'

      expect(getAuth()).toBeInstanceOf(Authz)
    })
  })

  describe('getAccessToken', () => {
    it('calls getAccessToken function on auth instance', () => {
      savedOauthDomain = 'keycloak'
      const auth = getAuth()
      jest.spyOn(auth, 'getAccessToken')

      getAccessToken()

      expect(auth.getAccessToken).toHaveBeenCalled()
    })
  })

  describe('getAccessToken', () => {
    it('calls getAccessToken function on auth instance', () => {
      savedOauthDomain = 'keycloak'
      const auth = getAuth()
      jest.spyOn(auth, 'isAuthenticated')

      isAuthenticated()

      expect(auth.isAuthenticated).toHaveBeenCalled()
    })
  })

  describe('getAuthHeaders', () => {
    it('calls getAuthHeaders function on auth instance', () => {
      savedOauthDomain = 'keycloak'
      const auth = getAuth()
      jest.spyOn(auth, 'getAuthHeaders')

      getAuthHeaders()

      expect(auth.getAuthHeaders).toHaveBeenCalled()
    })
  })

  describe('authenticate', () => {
    it('calls authenticate function on auth instance', () => {
      savedOauthDomain = 'keycloak'
      const auth = getAuth()
      jest.spyOn(auth, 'authenticate')

      authenticate()

      expect(auth.authenticate).toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('calls login for keycloak instance', () => {
      configuration.keycloak = {}
      savedOauthDomain = 'keycloak'
      const auth = getAuth()
      jest.spyOn(auth, 'login')

      login('keycloak')

      expect(auth.login).toHaveBeenCalled()
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'oauthDomain',
        'keycloak'
      )
    })

    it('calls login for authz instance', () => {
      savedOauthDomain = ''
      const auth = getAuth()
      jest.spyOn(auth, 'login')

      login('datapunt')

      expect(auth.login).toHaveBeenCalledWith('datapunt')
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'oauthDomain',
        'datapunt'
      )
    })

    it('throws when user has no storage support', () => {
      const storage = global.Storage
      global.Storage = undefined

      expect(login('datapunt')).rejects.toThrow(
        'Storage not available; cannot proceed with logging in'
      )

      global.Storage = storage
    })
  })

  describe('logout', () => {
    it('calls logout function', () => {
      const auth = getAuth()
      jest.spyOn(auth, 'logout')

      logout()

      expect(auth.logout).toHaveBeenCalled()
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('oauthDomain')
    })
  })
})
