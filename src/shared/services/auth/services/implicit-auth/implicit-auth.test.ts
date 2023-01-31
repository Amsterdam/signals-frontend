// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import 'jest-localstorage-mock'
import { mocked } from 'jest-mock'

import ImplicitAuth from '.'
import configuration from '../../../configuration/configuration'
import parseAccessToken from '../parse-access-token'
import queryStringParser from '../query-string-parser'
import randomStringGenerator from '../random-string-generator'

jest.mock('shared/services/configuration/configuration')
jest.mock('../query-string-parser')
jest.mock('../parse-access-token')
jest.mock('../random-string-generator')

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

describe('ImplicitAuth authorization', () => {
  const noop = () => {}
  const implicitauth = new ImplicitAuth()

  let queryObject: Record<string, string>
  let savedAccessToken: string
  let savedStateToken: string
  let savedNonce: string
  let savedOauthDomain: string
  let randomString: string

  beforeEach(() => {
    mocked(global.localStorage.getItem).mockImplementation((key) => {
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

    mocked(parseAccessToken).mockImplementation(() => ({} as any))
    mocked(queryStringParser).mockImplementation(() => queryObject)
    mocked(randomStringGenerator).mockImplementation(() => randomString)

    queryObject = {}
    randomString = 'random-string'
    savedStateToken = ''
    savedNonce = ''
    savedAccessToken = ''
  })

  afterEach(() => {
    ;(configuration as any).__reset()

    mocked(global.history.replaceState).mockRestore()
    mocked(global.location.assign).mockRestore()
    mocked(global.location.reload).mockRestore()

    mocked(global.localStorage.removeItem).mockReset()
    mocked(global.localStorage.setItem).mockReset()
  })

  describe('receiving response errors from the auth service', () => {
    it('throws an error', async () => {
      const queryString =
        '?error=invalid_request&error_description=invalid%20request'

      global.location.search = queryString
      queryObject = {
        error: 'invalid_request',
        error_description: 'invalid request',
      }

      await expect(async () => {
        implicitauth.init()
      }).rejects.toThrow(
        'Authorization service responded with error invalid_request [invalid request] (The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.)'
      )
      expect(queryStringParser).toHaveBeenCalledWith(queryString)
    })

    it('throws an error without a description in the query string', async () => {
      queryObject = {
        error: 'invalid_request',
      }

      await expect(async () => {
        implicitauth.init()
      }).rejects.toThrow()
    })

    it('removes the state token from the local storage', async () => {
      queryObject = {
        error: 'invalid_request',
      }

      await expect(async () => {
        implicitauth.init()
      }).rejects.toThrow()
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('stateToken')
    })

    it('does not handle any errors without an error in the query string', () => {
      queryObject = {}

      expect(async () => {
        implicitauth.init()
      }).not.toThrow()
      expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
        'stateToken'
      )
    })

    it('does not handle any errors without a query string', () => {
      ;(queryObject as any) = undefined

      expect(async () => {
        implicitauth.init()
      }).not.toThrow()
      expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
        'stateToken'
      )
    })

    describe('receiving a successful callback from the auth service', () => {
      it('throws an error when the state token received does not match the one saved', async () => {
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

        await expect(async () => {
          implicitauth.init()
        }).rejects.toThrow(
          'Authenticator encountered an invalid state token (invalid-state-token)'
        )
        expect(queryStringParser).toHaveBeenLastCalledWith(`#${queryString}`)
      })

      it('throws an error when the nonce received does not match the one saved', async () => {
        mocked(parseAccessToken).mockImplementation(
          () =>
            ({
              nonce: 'invalid-random-nonce',
            } as any)
        )

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

        await expect(async () => {
          implicitauth.init()
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

        implicitauth.init()
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

        implicitauth.init()
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

        implicitauth.init()
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
        implicitauth.login()
      }).toThrow('crypto library is not available on the current browser')
    })

    it('Updates the local storage', () => {
      const hash = '#?the=current-hash'
      global.location.hash = hash

      implicitauth.login()

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

      const authWithTokenFlow = new ImplicitAuth()

      authWithTokenFlow.login()

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://example.com/oauth2/authorize' +
          '?client_id=test' +
          '&response_type=id_token' +
          '&scope=openid+email+profile' +
          '&state=random-string' +
          '&nonce=random-string' +
          '&redirect_uri=http%3A%2F%2Flocalhost%2Fmanage%2Fincidents'
      )
    })
  })

  describe('Logout process', () => {
    it('Removes the access token from local storage', () => {
      implicitauth.logout()
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

      implicitauth.init()
    })

    it('returns an empty string when the callback was unsuccessful', () => {
      implicitauth.init()
    })

    it('returns an empty string when there was an error callback', async () => {
      queryObject = {
        error: 'invalid_request',
      }

      await expect(async () => {
        implicitauth.init()
      }).rejects.toThrow()
    })
  })

  describe('Retrieving the auth headers', () => {
    it('Creates an object defining the headers', () => {
      savedAccessToken = '123AccessToken'
      implicitauth.init()
      const authHeaders = implicitauth.getAuthHeaders()

      expect(authHeaders).toEqual({
        Authorization: 'Bearer 123AccessToken',
      })
    })

    it('Creates an object defining no headers when no access token', () => {
      implicitauth.init()
      const authHeaders = implicitauth.getAuthHeaders()

      expect(authHeaders).toEqual({})
    })
  })

  describe('getIsAuthenticated', () => {
    it('returns false for expired token', () => {
      mocked(global.localStorage.getItem).mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return expiredToken
          default:
            return ''
        }
      })

      expect(implicitauth.getIsAuthenticated()).toEqual(false)
    })

    it('returns false for invalid token', () => {
      mocked(global.localStorage.getItem).mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return invalidToken
          default:
            return ''
        }
      })

      expect(implicitauth.getIsAuthenticated()).toEqual(false)
    })

    it('returns true', () => {
      const actual = jest.requireActual('../parse-access-token').default
      mocked(parseAccessToken).mockImplementation(actual)

      mocked(global.localStorage.getItem).mockImplementation((key) => {
        switch (key) {
          case 'accessToken':
            return validToken
          default:
            return ''
        }
      })

      expect(implicitauth.getIsAuthenticated()).toEqual(true)
    })
  })

  describe('authenticate', () => {
    it('should authenticate with credentials with accessToken', () => {
      mocked(parseAccessToken).mockImplementation(
        () =>
          ({
            name: 'Jan Klaasen',
            scopes: ['SIG/ALL'],
            expiresAt: 999999999999,
          } as any)
      )
      savedAccessToken = '123AccessToken'

      expect(implicitauth.authenticate()).toEqual({
        accessToken: '123AccessToken',
      })
    })

    it('should not authenticate without accessToken', () => {
      mocked(parseAccessToken).mockImplementation(
        () =>
          ({
            name: 'Jan Klaasen',
            scopes: ['SIG/ALL'],
          } as any)
      )

      expect(implicitauth.authenticate()).toEqual(null)
    })
  })
})
