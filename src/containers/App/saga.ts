// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { all, call, put, take, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router/immutable'
import * as Sentry from '@sentry/browser'

import { authCall } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants'
import {
  SET_SEARCH_QUERY,
  LOGIN,
  LOGOUT,
  AUTHENTICATE_USER,
  GET_SOURCES,
  POST_MESSAGE,
} from 'containers/App/constants'

import type { EventChannel } from '@redux-saga/core'
import { postMessage } from '../../shared/services/app-post-message'
import { logout, login } from '../../shared/services/auth/auth'
import fileUploadChannel from '../../shared/services/file-upload-channel'
import {
  authorizeUser,
  getSourcesFailed,
  getSourcesSuccess,
  loginFailed,
  logoutFailed,
  showGlobalNotification,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  AuthenticateUserAction,
  PostMessageAction,
} from './actions'

import type { User, DataResult, ApiError, UploadFile, Source } from './types'

export function* callLogout() {
  try {
    yield call(logout)
    yield put(push('/login'))
  } catch (error: unknown) {
    yield put(logoutFailed((error as Error)?.message))
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: 'Uitloggen is niet gelukt',
        type: TYPE_GLOBAL,
      })
    )
  }
}

export function* callPostMessage(action: PostMessageAction) {
  if (action.payload) {
    try {
      yield call(postMessage, action.payload)
    } catch (error) {
      yield put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Er is iets misgegaan',
          type: TYPE_GLOBAL,
        })
      )

      yield call([Sentry, 'captureException'], error)
    }
  }
}

export function* callLogin() {
  try {
    yield call(login)
  } catch (error) {
    yield put(loginFailed((error as Error)?.message))
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: (error as Error)?.message || 'Inloggen is niet gelukt',
        type: TYPE_GLOBAL,
      })
    )
  }
}

export function* callAuthorize(action: AuthenticateUserAction) {
  try {
    const accessToken = action.payload?.accessToken

    if (accessToken) {
      const user: User = yield call(
        authCall,
        configuration.AUTH_ME_ENDPOINT,
        null,
        accessToken
      )

      yield put(authorizeUser(user))
    }
  } catch (error: unknown) {
    const { response } = error as ApiError

    if (response.status === 401) {
      yield call(logout)
      yield put(push('/login'))
    } else {
      yield put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Authenticeren is niet gelukt',
          type: TYPE_GLOBAL,
        })
      )
    }
  }
}

export function* uploadFile(action: { payload: UploadFile }): any {
  const id = action.payload?.id ?? ''

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const channel: EventChannel<any> = yield call(
    fileUploadChannel,
    `${configuration.INCIDENT_PUBLIC_ENDPOINT}${id}/attachments/`,
    action.payload?.file,
    id
  )

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { progress = 0, error, success } = yield take(channel)

    if (error) {
      yield put(uploadFailure())
      yield put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Het uploaden van de foto is niet gelukt',
          type: TYPE_GLOBAL,
        })
      )
      return
    }

    if (success) {
      yield put(uploadSuccess())
      return
    }

    yield put(uploadProgress(progress))
  }
}

export function* callSearchIncidents() {
  yield put(push('/manage/incidents'))
}

export function* fetchSources() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: DataResult<Source> = yield call(
      authCall,
      configuration.SOURCES_ENDPOINT,
      { is_active: 'true' }
    )

    yield put(getSourcesSuccess(result.results))
  } catch (error: unknown) {
    yield put(getSourcesFailed((error as Error).message))
  }
}

export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGOUT, callLogout),
    takeLatest(POST_MESSAGE, callPostMessage),
    takeLatest(LOGIN, callLogin),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
    takeLatest(SET_SEARCH_QUERY, callSearchIncidents),
    takeLatest(GET_SOURCES, fetchSources),
  ])
}
