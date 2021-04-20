// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import configuration from '../../configuration/configuration'
import Authz from './authz'
import queryStringParser from './query-string-parser/query-string-parser'
import randomStringGenerator from './random-string-generator/random-string-generator'
import parseAccessToken from './parse-access-token/parse-access-token'

jest.mock('shared/services/configuration/configuration')
jest.mock('./query-string-parser/query-string-parser')
jest.mock('./parse-access-token/parse-access-token')
jest.mock('./random-string-generator/random-string-generator')
jest.mock('./random-string-generator/random-string-generator')

/* tokens generated with https://www.jsonwebtoken.io/ */
// token contains 'exp' prop with a date in the past
const expiredToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjZhNTc3NzZlLTczYWYtNDM3ZS1hMmJiLThmYTkxYWVhN2QxYSIsImlhdCI6MTU4ODE2Mjk2MywiZXhwIjoxMjQyMzQzfQ.RbJHkXRPmFZMYDJs-gxhk7vWYlIYZi8uik83Q0V1nas'

// token doesn't have 'exp' prop
const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// token contains 'exp' prop with a date far into the future
const validToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImMxOWRhNDgwLTAyM2UtNGM2YS04NDM2LWNhMzNkYzZjYzVlMyIsImlhdCI6MTU4ODE2NDUyMCwiZXhwIjoxNTg4MTY4MTQ1MH0.LMA3E950H0EACrvME7Gps1Y-Q43Fux1q8YCJUl9pbYE'

describe('Authz authorization', () => {
  const noop = () => {}
  const authz = new Authz()

  let queryObject
  let savedAccessToken
  let savedStateToken
  let savedNonce
  let savedOauthDomain
  let randomString

  beforeEach(() => {
    global.localStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'accessToken':
          return savedAccessToken
        case 'stateToken':
          return savedStateToken
        case 'nonce':
          return savedNonce
        case 'oauthDomain':
          return savedOauthDomain
        default:
          return ''
      }
    })

    Object.defineProperties(global, {
      location: {
        writable: true,
        value: {
          ...global.location,
          assign: jest.fn(),
          reload: jest.fn(),
        },
      },
    })

    Object.defineProperty(global.history, 'replaceState', {
      writable: true,
      configurable: true,
      value: jest.fn(),
    })

    jest.spyOn(global.history, 'replaceState').mockImplementation(noop)
    jest.spyOn(global.location, 'assign').mockImplementation(noop)
    jest.spyOn(global.location, 'reload').mockImplementation(noop)
    global.location.search = ''
    global.location.hash = ''

    parseAccessToken.mockImplementation(() => ({}))
    queryStringParser.mockImplementation(() => queryObject)
    randomStringGenerator.mockImplementation(() => randomString)

    queryObject = {}
    randomString = 'random-string'
    savedStateToken = ''
    savedNonce = ''
    savedAccessToken = ''
  })

  afterEach(() => {
    configuration.__reset()

    global.history.replaceState.mockRestore()
    global.location.assign.mockRestore()
    global.location.reload.mockRestore()

    global.localStorage.removeItem.mockReset()
    global.localStorage.setItem.mockReset()
  })

  describe('authz', () => {
    describe('receiving response errors from the auth service', () => {
      it('throws an error', () => {
        const queryString =
          '?error=invalid_request&error_description=invalid%20request'

        global.location.search = queryString
        queryObject = {
          error: 'invalid_request',
          error_description: 'invalid request',
        }

        expect(async () => {
          authz.init()
        }).rejects.toThrow(
          'Authorization service responded with error invalid_request [invalid request] (The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.)'
        )
        expect(queryStringParser).toHaveBeenCalledWith(queryString)
      })

      it('throws an error without a description in the query string', () => {
        queryObject = {
          error: 'invalid_request',
        }

        expect(async () => {
          authz.init()
        }).rejects.toThrow()
      })

      it('removes the state token from the local storage', () => {
        queryObject = {
          error: 'invalid_request',
        }

        expect(async () => {
          authz.init()
        }).rejects.toThrow()
        expect(global.localStorage.removeItem).toHaveBeenCalledWith(
          'stateToken'
        )
      })

      it('does not handle any errors without an error in the query string', () => {
        queryObject = {}

        expect(async () => {
          authz.init()
        }).not.toThrow()
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        )
      })

      it('does not handle any errors without a query string', () => {
        queryObject = undefined

        expect(async () => {
          authz.init()
        }).not.toThrow()
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        )
      })
    })

    describe('receiving a successful callback from the auth service', () => {
      it('throws an error when the state token received does not match the one saved', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=invalid-state-token'
        global.location.hash = `#${queryString}`
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'invalid-state-token',
        }
        savedStateToken = 'state-token'

        expect(async () => {
          authz.init()
        }).rejects.toThrow(
          'Authenticator encountered an invalid state token (invalid-state-token)'
        )
        expect(queryStringParser).toHaveBeenLastCalledWith(`#${queryString}`)
      })

      it('throws an error when the nonce received does not match the one saved', () => {
        parseAccessToken.mockImplementation(() => ({
          nonce: 'invalid-random-nonce',
        }))

        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=state-token'
        global.location.hash = `#${queryString}`
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'state-token',
        }

        savedStateToken = 'state-token'
        savedNonce = 'random-nonce'

        expect(async () => {
          authz.init()
        }).rejects.toThrow(
          'Authenticator encountered an invalid nonce (invalid-random-nonce)'
        )
        expect(queryStringParser).toHaveBeenLastCalledWith(`#${queryString}`)
      })

      it('Updates local storage', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=random-string'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'random-string',
        }
        savedStateToken = 'random-string'

        authz.init()
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        )
        expect(global.localStorage.removeItem).toHaveBeenCalledWith(
          'stateToken'
        )
      })

      it('Works when receiving unexpected parameters', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=random-string&extra=sauce'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'random-string',
          extra: 'sauce',
        }
        savedStateToken = 'random-string'

        authz.init()
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        )
      })

      it('Does not work when a parameter is missing', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&state=random-string'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          state: 'random-string',
        }
        savedStateToken = 'random-string'

        authz.init()
        expect(global.localStorage.setItem).not.toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        )
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        )
      })
    })
  })

  describe('Login process', () => {
    it('throws an error when the crypto library is not supported by the browser', () => {
      randomString = ''
      expect(() => {
        authz.login()
      }).toThrow('crypto library is not available on the current browser')
    })

    it('Updates the local storage', () => {
      const hash = '#?the=current-hash'
      global.location.hash = hash

      authz.login()

      expect(global.localStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'stateToken',
        randomString
      )
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'nonce',
        randomString
      )
    })

    it('Redirects to the auth service with token flow', () => {
      configuration.oidc.authEndpoint = 'https://example.com/oauth2/authorize'
      configuration.oidc.clientId = 'test'

      const authzWithTokenFlow = new Authz()

      authzWithTokenFlow.login()

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://example.com/oauth2/authorize' +
          '?client_id=test' +
          '&response_type=id_token' +
          '&scope=openid+email+profile' +
          '&state=random-string' +
          '&nonce=random-string' +
          '&redirect_uri=http%3A%2F%2Flocalhost%2Fmanage%2Fincidents' +
          '&idp_id=datapunt'
      )
    })
  })

  describe('Logout process', () => {
    it('Removes the access token from local storage', () => {
      authz.logout()
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('accessToken')
    })
  })

  describe('Retrieving the return path', () => {
    it('returns the return path after initialized with a successful callback', () => {
      queryObject = {
        access_token: '123AccessToken',
        token_type: 'token',
        expires_in: '36000',
        state: 'random-string',
      }
      savedStateToken = 'random-string'

      authz.init()
    })

    it('returns an empty string when the callback was unsuccessful', () => {
      authz.init()
    })

    it('returns an empty string when there was an error callback', () => {
      queryObject = {
        error: 'invalid_request',
      }

      expect(async () => {
        authz.init()
      }).rejects.toThrow()
    })
  })

  describe('Retrieving the auth headers', () => {
    it('Creates an object defining the headers', () => {
      savedAccessToken = '123AccessToken'
      authz.init()
      const authHeaders = authz.getAuthHeaders()

      expect(authHeaders).toEqual({
        Authorization: 'Bearer 123AccessToken',
      })
    })

    it('Creates an object defining no headers when no access token', () => {
      authz.init()
      const authHeaders = authz.getAuthHeaders()

      expect(authHeaders).toEqual({})
    })
  })

  describe('isAuthenticated', () => {
    it('returns false for expired token', () => {
      global.localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return expiredToken
          default:
            return ''
        }
      })

      expect(authz.isAuthenticated()).toEqual(false)
    })

    it('returns false for invalid token', () => {
      global.localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return invalidToken
          default:
            return ''
        }
      })

      expect(authz.isAuthenticated()).toEqual(false)
    })

    it('returns true', () => {
      const actual = jest.requireActual(
        './parse-access-token/parse-access-token'
      ).default
      parseAccessToken.mockImplementation(actual)

      global.localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return validToken
          default:
            return ''
        }
      })

      expect(authz.isAuthenticated()).toEqual(true)
    })
  })

  describe('authenticate', () => {
    it('should authenticate with credentials with accessToken', () => {
      parseAccessToken.mockImplementation(() => ({
        name: 'Jan Klaasen',
        scopes: ['SIG/ALL'],
        expiresAt: 999999999999,
      }))
      savedAccessToken = '123AccessToken'

      expect(authz.authenticate()).toEqual({
        userName: 'Jan Klaasen',
        userScopes: ['SIG/ALL'],
        accessToken: '123AccessToken',
      })
    })

    it('should not authenticate without accessToken', () => {
      parseAccessToken.mockImplementation(() => ({
        name: 'Jan Klaasen',
        scopes: ['SIG/ALL'],
      }))

      expect(authz.authenticate()).toEqual(null)
    })
  })
})
