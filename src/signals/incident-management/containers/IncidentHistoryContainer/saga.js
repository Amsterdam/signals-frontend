import { all, put, takeLatest } from 'redux-saga/effects';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall } from 'shared/services/api/api';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListSuccess, requestHistoryListError } from './actions';

// const baseURL = '/api/auth/auth/status';
// export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/note`;

export function* fetchIncidentHistoryList(action) {
  const signalId = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/${signalId}/history`;
  try {
    const incidentHistoryList = yield authCall(requestURL);
    yield put(requestHistoryListSuccess(incidentHistoryList));
  } catch (error) {
    yield put(requestHistoryListError(error));
  }
}

export default function* watchIncidentHistoryContainerSaga() {
  yield all([
    takeLatest(REQUEST_HISTORY_LIST, fetchIncidentHistoryList)
  ]);
}
