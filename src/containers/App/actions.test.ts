// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { testActionCreator } from 'test/utils'
import userJson from 'utils/__tests__/fixtures/user.json'

import {
  authenticateUser,
  authorizeUser,
  doLogin,
  doLogout,
  getSources,
  getSourcesFailed,
  getSourcesSuccess,
  postMessage,
  resetGlobalNotification,
  resetSearchQuery,
  setSearchQuery,
  showGlobalNotification,
  uploadFailure,
  uploadProgress,
  uploadSuccess,
} from './actions'
import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
  GET_SOURCES,
  LOGIN,
  LOGOUT,
  POST_MESSAGE,
  RESET_GLOBAL_NOTIFICATION,
  RESET_SEARCH_QUERY,
  SET_SEARCH_QUERY,
  SHOW_GLOBAL_NOTIFICATION,
  UPLOAD_FAILURE,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
} from './constants'

describe('containers/App/actions', () => {
  it('should dispatch authenticate user action', () => {
    testActionCreator(authenticateUser, AUTHENTICATE_USER, userJson)
  })

  it('should dispatch authorize user, action', () => {
    testActionCreator(authorizeUser, AUTHORIZE_USER, userJson)
  })

  it('should dispatch show global error action', () => {
    const payload = {
      title: 'global error',
      message: 'Here be dragons',
      variant: 'error',
      type: 'global',
    }

    testActionCreator(showGlobalNotification, SHOW_GLOBAL_NOTIFICATION, payload)
  })

  it('should dispatch reset global error action', () => {
    testActionCreator(resetGlobalNotification, RESET_GLOBAL_NOTIFICATION)
  })

  it('should dispatch login action', () => {
    const payload = null
    testActionCreator(doLogin, LOGIN, payload)
  })

  it('should dispatch logout action', () => {
    const payload = null
    testActionCreator(doLogout, LOGOUT, payload)
  })

  it('should dispatch upload progess action', () => {
    const payload = 0.666
    testActionCreator(uploadProgress, UPLOAD_PROGRESS, payload)
  })

  it('should dispatch upload success action', () => {
    testActionCreator(uploadSuccess, UPLOAD_SUCCESS)
  })

  it('should dispatch upload failure action', () => {
    testActionCreator(uploadFailure, UPLOAD_FAILURE)
  })

  it('should dispatch setSearchQuery action', () => {
    const searchQuery = 'stoeptegels'
    testActionCreator(setSearchQuery, SET_SEARCH_QUERY, searchQuery)
  })

  it('should dispatch resetSearchQuery action', () => {
    testActionCreator(resetSearchQuery, RESET_SEARCH_QUERY)
  })

  it('should dispatch getSourcesSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(getSourcesSuccess, GET_SOURCES_SUCCESS, payload)
  })

  it('should dispatch getSourcesFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(getSourcesFailed, GET_SOURCES_FAILED, payload)
  })

  it('should dispatch getSources action', () => {
    testActionCreator(getSources, GET_SOURCES)
  })

  it('should dispatch postMessage action', () => {
    const payload = 'foo'
    testActionCreator(postMessage, POST_MESSAGE, payload)
  })
})
