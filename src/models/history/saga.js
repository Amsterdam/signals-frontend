import { call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, getErrorMessage } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListSuccess, requestHistoryListError } from './actions';

export function* fetchHistoryList(action) {
  const signalId = action.payload;
  const requestURL = `${CONFIGURATION.INCIDENTS_ENDPOINT}${signalId}/history`;

  try {
    const list = yield authCall(requestURL);
    yield put(requestHistoryListSuccess(list));
  } catch (error) {
    yield put(requestHistoryListError(error));

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De melding geschiedenis kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    yield call([Sentry, 'captureException'], error);
  }
}

export default function* watchHistorySaga() {
  yield takeLatest(REQUEST_HISTORY_LIST, fetchHistoryList);
}
