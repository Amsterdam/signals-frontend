// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { put, takeLatest } from 'redux-saga/effects'

import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { authCall, getErrorMessage } from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'

import { requestHistoryListSuccess, requestHistoryListError } from './actions'
import { REQUEST_HISTORY_LIST } from './constants'

export function* fetchHistoryList(action) {
  const signalId = action.payload
  const requestURL = `${CONFIGURATION.INCIDENTS_ENDPOINT}${signalId}/history`

  try {
    const list = yield authCall(requestURL)
    yield put(requestHistoryListSuccess(list))
  } catch (error) {
    yield put(requestHistoryListError(error))

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De melding geschiedenis kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )
  }
}

export default function* watchHistorySaga() {
  yield takeLatest(REQUEST_HISTORY_LIST, fetchHistoryList)
}
