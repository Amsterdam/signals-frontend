import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { authPostCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_PRIORITY_UPDATE } from './constants';
import { requestPriorityUpdateSuccess, requestPriorityUpdateError } from './actions';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/priority`;

export function* updateIncidentPriority(action) {
  const requestURL = `${baseUrl}/`;

  try {
    const updatedPriority = yield authPostCall(requestURL, action.payload);
    yield call(delay, 1000);
    yield put(requestPriorityUpdateSuccess(updatedPriority));
  } catch (error) {
    yield put(requestPriorityUpdateError(error));
  }
}

export default function* watchIncidentPrioritySaga() {
  yield takeLatest(REQUEST_PRIORITY_UPDATE, updateIncidentPriority);
}
