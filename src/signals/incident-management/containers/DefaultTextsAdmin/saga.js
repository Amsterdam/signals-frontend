// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { all, call, put, takeLatest } from 'redux-saga/effects'

import { showGlobalNotification } from 'containers/App/actions'
import {
  VARIANT_SUCCESS,
  VARIANT_ERROR,
  TYPE_LOCAL,
} from 'containers/Notification/constants'
import {
  authCall,
  authPostCall,
  getErrorMessage,
} from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'

import {
  fetchDefaultTextsSuccess,
  fetchDefaultTextsError,
  storeDefaultTextsSuccess,
  storeDefaultTextsError,
} from './actions'
import { FETCH_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS } from './constants'

export function* fetchDefaultTexts(action) {
  try {
    const payload = action.payload
    const result = yield call(
      authCall,
      `${CONFIGURATION.TERMS_ENDPOINT}${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`
    )
    const found = result.find((item) => item.state === payload.state)
    yield put(fetchDefaultTextsSuccess(found?.templates || []))
  } catch (error) {
    yield put(fetchDefaultTextsError(error))

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het standaard teksten overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )
  }
}

export function* storeDefaultTexts(action) {
  try {
    const payload = action.payload
    const { subcategory } = payload
    const result = yield call(
      authPostCall,
      `${CONFIGURATION.TERMS_ENDPOINT}${payload.main_slug}/sub_categories/${payload.subcategory.slug}/status-message-templates`,
      [payload.post]
    )

    const found = result.find((item) => item?.state === payload.post.state)

    yield put(storeDefaultTextsSuccess(found?.templates || []))

    yield put(
      showGlobalNotification({
        title: `Standaard teksten bijgewerkt voor ${subcategory.value}, ${payload.status.value}`,
        variant: VARIANT_SUCCESS,
        type: TYPE_LOCAL,
      })
    )
  } catch (error) {
    yield put(storeDefaultTextsError(error))

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De standaard teksten konden niet opgeslagen worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )
  }
}

export default function* watchDefaultTextsAdminSaga() {
  yield all([
    takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts),
    takeLatest(STORE_DEFAULT_TEXTS, storeDefaultTexts),
  ])
}
