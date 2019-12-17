import { put, takeLatest } from 'redux-saga/effects';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall } from 'shared/services/api/api';

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
  }
}

export default function* watchHistorySaga() {
  yield takeLatest(REQUEST_HISTORY_LIST, fetchHistoryList);
}
