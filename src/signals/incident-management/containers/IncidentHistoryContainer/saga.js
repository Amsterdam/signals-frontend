import { all, put, takeLatest } from 'redux-saga/effects';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall } from 'shared/services/api/api';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListSuccess, requestHistoryListError } from './actions';

// const baseURL = '/api/auth/auth/status';
export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/note`;

export function* fetchIncidentHistoryList(action) {
  const signalId = action.payload;
  const requestURL = `${baseUrl}`;

  try {
    const incidentHistoryList = yield authCall(requestURL, { _signal__id: signalId });
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
