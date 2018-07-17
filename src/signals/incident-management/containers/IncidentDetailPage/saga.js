import { put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_INCIDENT } from './constants';
import { requestIncidentSuccess, requestIncidentError } from './actions';
import { authCall } from '../../../../shared/services/api/api';

export function* fetchIncident(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/signal`;
  try {
    const id = action.payload;
    const incident = yield authCall(`${requestURL}/${id}`);
    yield put(requestIncidentSuccess(incident));
  } catch (err) {
    yield put(requestIncidentError(err));
  }
}

// Individual exports for testing
export default function* watchRequestIncidentSaga() {
  yield takeLatest(REQUEST_INCIDENT, fetchIncident);
}
