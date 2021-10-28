// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import * as Sentry from '@sentry/browser'
import 'jest-localstorage-mock'
import { call, put, take, takeLatest } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import { mocked } from 'ts-jest/utils'
import { push } from 'connected-react-router/immutable'
import { testSaga, expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import configuration from 'shared/services/configuration/configuration'
import type endpointDefinitions from 'shared/services/configuration/endpoint-definitions'
import { authCall } from 'shared/services/api/api'
import { login, logout } from 'shared/services/auth/auth'
import fileUploadChannel from 'shared/services/file-upload-channel'
import randomStringGenerator from 'shared/services/auth/services/random-string-generator/random-string-generator'
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants'
import userJson from 'utils/__tests__/fixtures/user.json'

import type { SagaGeneratorType } from 'types'
import { postMessage } from 'shared/services/app-post-message'
import watchAppSaga, {
  callLogin,
  callLogout,
  callAuthorize,
  uploadFile,
  callSearchIncidents,
  fetchSources,
  callPostMessage,
} from './saga'
import {
  LOGOUT,
  AUTHENTICATE_USER,
  SET_SEARCH_QUERY,
  GET_SOURCES,
  POST_MESSAGE,
  LOGIN,
} from './constants'
import {
  AuthenticateUserAction,
  loginFailed,
  PostMessageAction,
} from './actions'
import {
  logoutFailed,
  authorizeUser,
  showGlobalNotification,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  getSourcesFailed,
  getSourcesSuccess,
} from './actions'
import type { UploadFile, ApiError } from './types'

jest.mock('@sentry/browser')
jest.mock('shared/services/auth/auth')
jest.mock(
  'shared/services/auth/services/random-string-generator/random-string-generator'
)
jest.mock('shared/services/api/api')
jest.mock('shared/services/map-categories')
jest.mock('shared/services/file-upload-channel')

const CONFIGURATION = configuration as typeof endpointDefinitions

Object.defineProperties(global, {
  location: {
    writable: true,
    value: {
      ...global.location,
      reload: jest.fn(),
    },
  },
})

describe('containers/App/saga', () => {
  let origLocalStorage: typeof global.localStorage

  beforeEach(() => {
    mocked(randomStringGenerator).mockImplementation(
      () => 'n8vd9fv528934n797cv342bj3h56'
    )
    global.window.open = jest.fn()
    origLocalStorage = global.localStorage
    global.localStorage = {
      getItem: (key) => {
        switch (key) {
          case 'accessToken':
            return '42'
          case 'oauthDomain':
            return 'login-domain.it'
          default:
            return ''
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 3,
    }
  })

  afterEach(() => {
    global.localStorage = origLocalStorage
    jest.resetAllMocks()
  })

  it('should watchAppSaga', () => {
    testSaga(watchAppSaga)
      .next()
      .all([
        takeLatest(LOGOUT, callLogout),
        takeLatest(POST_MESSAGE, callPostMessage),
        takeLatest(LOGIN, callLogin),
        takeLatest(AUTHENTICATE_USER, callAuthorize),
        takeLatest(SET_SEARCH_QUERY, callSearchIncidents),
        takeLatest(GET_SOURCES, fetchSources),
      ])
      .next()
      .isDone()
  })

  describe('login', () => {
    it('should dispatch success', () => {
      testSaga(callLogin).next().call(login).next().isDone()
    })

    it('should dispatch error', async () => {
      mocked(login).mockRejectedValue(new Error('aargh'))

      return expectSaga(callLogin)
        .call(login)
        .put(loginFailed('aargh'))
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'aargh',
            type: TYPE_GLOBAL,
          })
        )
        .run()
    })
  })

  describe('logout', () => {
    it('should dispatch success', () => {
      testSaga(callLogout)
        .next()
        .call(logout)
        .next()
        .put(push('/login'))
        .next()
        .isDone()
    })

    it('should dispatch error', async () => {
      const message = 'no remove'
      mocked(logout).mockImplementation(() => {
        throw new Error(message)
      })

      return expectSaga(callLogout)
        .call(logout)
        .put(logoutFailed(message))
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Uitloggen is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
        .run()
    })
  })

  describe('postMessage', () => {
    it('should dispatch postMessage', () => {
      const action: PostMessageAction = {
        type: POST_MESSAGE,
        payload: 'foo',
      }

      return expectSaga(callPostMessage, action).call(postMessage, 'foo').run()
    })

    it('should dispatch notification on error', () => {
      const action: PostMessageAction = {
        type: POST_MESSAGE,
        payload: 'foo',
      }
      const error = new Error('foo')

      return expectSaga(callPostMessage, action)
        .provide([[matchers.call.fn(postMessage), throwError(error)]])
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Er is iets misgegaan',
            type: TYPE_GLOBAL,
          })
        )
        .call([Sentry, 'captureException'], error)
        .run()
    })
  })

  describe('callAuthorize', () => {
    beforeEach(() => {
      // mocking reload function in global location object, since jsdom doesn't support reload and will throw an error
      mocked(global.location).reload = jest.fn()
    })

    afterEach(() => {
      mocked(global.location).reload.mockRestore()
    })

    const payload = {
      userName: '',
      accessToken: 'akjgrff',
      userScopes: [],
    }

    it('should dispatch success', async () => {
      const action: AuthenticateUserAction = {
        type: AUTHENTICATE_USER,
        payload,
      }

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), userJson]])
        .call(
          authCall,
          CONFIGURATION.AUTH_ME_ENDPOINT,
          null,
          payload.accessToken
        )
        .put(authorizeUser(userJson))
        .run()
    })

    it('should fail without message when accessToken is not available', async () => {
      const action: AuthenticateUserAction = { type: AUTHENTICATE_USER }

      return expectSaga(callAuthorize, action).not.call(authCall).run()
    })

    it('should dispatch error when authorization has failed', async () => {
      const action: AuthenticateUserAction = {
        type: AUTHENTICATE_USER,
        payload,
      }
      const errorObj = {
        ...new Error('Whoops'),
        response: {
          status: 403,
        },
      }

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), throwError(errorObj)]])
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Authenticeren is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
        .run()
    })

    it('should dispatch error when session has expired', async () => {
      const action: AuthenticateUserAction = {
        type: AUTHENTICATE_USER,
        payload,
      }
      const errorObj: ApiError = {
        name: 'error',
        message: 'Whoops',
        response: {
          status: 401,
        },
      }

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), throwError(errorObj)]])
        .call(logout)
        .run()
    })
  })

  describe('uploadFile', () => {
    let payload: UploadFile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockChannel: any
    let gen: SagaGeneratorType

    beforeEach(() => {
      payload = {
        id: 666,
        file: { name: 'image.jpg' },
      }
      mockChannel = channel()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      gen = uploadFile({ payload })
    })

    it('should success', () => {
      expect(gen.next().value).toEqual(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        call(
          fileUploadChannel,
          `${CONFIGURATION.INCIDENT_PUBLIC_ENDPOINT}${payload.id}/attachments/`,
          { name: 'image.jpg' },
          payload.id
        )
      ) // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)) // eslint-disable-line redux-saga/yield-effects

      expect(
        gen.next({
          progress: 0.23,
          error: false,
          success: false,
        }).value
      ).toEqual(put(uploadProgress(0.23))) // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)) // eslint-disable-line redux-saga/yield-effects
      expect(
        gen.next({
          progress: 1,
          error: false,
          success: true,
        }).value
      ).toEqual(put(uploadSuccess())) // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined()
    })

    it('should fail', () => {
      expect(gen.next().value).toEqual(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        call(
          fileUploadChannel,
          `${CONFIGURATION.INCIDENT_PUBLIC_ENDPOINT}${payload.id}/attachments/`,
          { name: 'image.jpg' },
          payload.id
        )
      ) // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)) // eslint-disable-line redux-saga/yield-effects

      expect(
        gen.next({
          error: false,
          success: false,
        }).value
      ).toEqual(put(uploadProgress(0))) // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)) // eslint-disable-line redux-saga/yield-effects
      expect(
        gen.next({
          progress: 1,
          error: true,
          success: false,
        }).value
      ).toEqual(put(uploadFailure())) // eslint-disable-line redux-saga/yield-effects
      expect(gen.next().value).toEqual(
        put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Het uploaden van de foto is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
      ) // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined()
    })
  })

  describe('callSelectIncidents', () => {
    it('should navigate to the manage/incidents', () => {
      const gen = callSearchIncidents()
      expect(gen.next().value).toEqual(put(push('/manage/incidents'))) // eslint-disable-line redux-saga/yield-effects
    })
  })

  describe('fetch sources', () => {
    it('should dispatch getSourcesSuccess', () => {
      const sources = { results: [{ id: 1, name: 'a' }] }

      testSaga(fetchSources)
        .next()
        .call(authCall, CONFIGURATION.SOURCES_ENDPOINT, { is_active: 'true' })
        .next(sources)
        .put(getSourcesSuccess(sources.results))
        .next()
        .isDone()
    })

    it('should dispatch getSourcesFailed', () => {
      const message = '404 not found'
      const error = new Error(message)

      testSaga(fetchSources)
        .next()
        .call(authCall, CONFIGURATION.SOURCES_ENDPOINT, { is_active: 'true' })
        .throw(error)
        .put(getSourcesFailed(message))
        .next()
        .isDone()
    })
  })
})
