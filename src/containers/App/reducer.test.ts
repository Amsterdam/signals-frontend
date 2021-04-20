// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import userJson from 'utils/__tests__/fixtures/user.json'
import { APPLY_FILTER } from 'signals/incident-management/constants'
import type { ApplyFilterActionType } from './reducer'
import appReducer, { initialState } from './reducer'
import {
  AUTHORIZE_USER,
  LOGIN_FAILED,
  LOGOUT_FAILED,
  LOGOUT,
  RESET_GLOBAL_NOTIFICATION,
  SHOW_GLOBAL_NOTIFICATION,
  UPLOAD_FAILURE,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  SET_SEARCH_QUERY,
  RESET_SEARCH_QUERY,
  GET_SOURCES,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
} from './constants'
import type {
  DoLogoutAction,
  GetSourcesAction,
  GetSourcesFailedAction,
  GetSourcesSuccessAction,
  ResetSearchQueryAction,
  SetSearchQueryAction,
} from './actions'

describe('containers/App/reducer', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, { type: null, payload: undefined })).toEqual(
      initialState
    )
  })

  describe('AUTHORIZE_USER', () => {
    it('sets user name, scopes and access token', () => {
      expect(
        appReducer(initialState, {
          type: AUTHORIZE_USER,
          payload: userJson,
        })
      ).toEqual({ ...initialState, user: userJson })
    })
  })

  describe('SHOW_GLOBAL_NOTIFICATION', () => {
    it('sets global notification', () => {
      expect(
        appReducer(initialState, {
          type: SHOW_GLOBAL_NOTIFICATION,
          payload: {
            title: 'title',
            message: 'message',
            variant: 'error',
            type: 'global',
          },
        })
      ).toEqual({
        ...initialState,
        notification: {
          title: 'title',
          message: 'message',
          variant: 'error',
          type: 'global',
        },
      })
    })
  })

  describe('RESET_GLOBAL_NOTIFICATION', () => {
    it('resets global notification', () => {
      expect(
        appReducer(initialState, {
          type: RESET_GLOBAL_NOTIFICATION,
        })
      ).toEqual({
        ...initialState,
        notification: initialState.notification,
      })
    })
  })

  describe('UPLOAD_PROGRESS', () => {
    it('file upload progress', () => {
      expect(
        appReducer(
          {
            ...initialState,
          },
          {
            type: UPLOAD_PROGRESS,
            payload: 0.345,
          }
        )
      ).toEqual({
        ...initialState,
        upload: {
          progress: 0.345,
        },
      })
    })
  })

  describe('UPLOAD_SUCCESS', () => {
    it('file upload success', () => {
      expect(
        appReducer(
          {
            ...initialState,
            upload: {
              progress: 0.678,
            },
          },
          {
            type: UPLOAD_SUCCESS,
          }
        )
      ).toEqual({
        ...initialState,
        upload: {},
      })
    })
  })

  describe('UPLOAD_FAILURE', () => {
    it('file upload failure', () => {
      expect(
        appReducer(
          {
            ...initialState,
            upload: {
              progress: 0.678,
            },
          },
          {
            type: UPLOAD_FAILURE,
          }
        )
      ).toEqual({
        ...initialState,
        upload: {},
      })
    })
  })

  describe('LOGIN_FAILED', () => {
    it('should handle failed login', () => {
      expect(
        appReducer(initialState, {
          type: LOGIN_FAILED,
          payload: 'ERROR_MESSAGE',
        })
      ).toEqual({
        ...initialState,
        error: 'ERROR_MESSAGE',
        loading: false,
      })
    })
  })

  describe('LOGOUT_FAILED', () => {
    it('should handle failed logout', () => {
      expect(
        appReducer(initialState, {
          type: LOGOUT_FAILED,
          payload: 'ERROR_MESSAGE',
        })
      ).toEqual({
        ...initialState,
        error: 'ERROR_MESSAGE',
        loading: false,
      })
    })
  })

  describe('LOGOUT', () => {
    it('should handle logout', () => {
      const mockedState = {
        ...initialState,
        user: {
          ...userJson,
        },
        notification: {
          ...initialState.notification,
          message: 'This is a notifictation',
        },
      }

      const action: DoLogoutAction = {
        type: LOGOUT,
      }

      expect(appReducer(mockedState, action)).toEqual({
        ...mockedState,
        user: { ...initialState.user },
        upload: { ...initialState.upload },
      })
    })
  })

  it('should handle SET_SEARCH_QUERY', () => {
    const searchQueryAction: SetSearchQueryAction = {
      type: SET_SEARCH_QUERY,
      payload: 'stoeptegels',
    }

    expect(appReducer(initialState, searchQueryAction)).toEqual({
      ...initialState,
      searchQuery: searchQueryAction.payload,
    })
  })

  it('should handle RESET_SEARCH_QUERY', () => {
    const resetSearchQueryAction: ResetSearchQueryAction = {
      type: RESET_SEARCH_QUERY,
    }

    expect(
      appReducer(
        {
          ...initialState,
          searchQuery: 'search-term',
        },
        resetSearchQueryAction
      )
    ).toEqual({
      ...initialState,
    })
  })

  it('should handle APPLY_FILTER', () => {
    const applyFilterAction: ApplyFilterActionType = {
      type: APPLY_FILTER,
    }

    expect(
      appReducer(
        {
          ...initialState,
          searchQuery: 'search-term',
        },
        applyFilterAction
      )
    ).toEqual({
      ...initialState,
    })
  })

  it('should handle GET_SOURCES', () => {
    const getSourcesAction: GetSourcesAction = {
      type: GET_SOURCES,
    }

    expect(appReducer(initialState, getSourcesAction)).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should handle GET_SOURCES_SUCCESS', () => {
    const sources = ['Source1', 'Source2']
    const getSourcesSuccessAction: GetSourcesSuccessAction = {
      type: GET_SOURCES_SUCCESS,
      payload: sources,
    }

    expect(appReducer(initialState, getSourcesSuccessAction)).toEqual({
      ...initialState,
      loading: false,
      sources,
    })
  })

  it('should handle GET_SOURCES_FAILED', () => {
    const getSourcesFailedAction: GetSourcesFailedAction = {
      type: GET_SOURCES_FAILED,
      payload: 'Could not retrieve!',
    }

    expect(appReducer(initialState, getSourcesFailedAction)).toEqual({
      ...initialState,
      loading: false,
      error: true,
      notification: {
        ...initialState.notification,
        message: getSourcesFailedAction.payload,
      },
    })
  })
})
