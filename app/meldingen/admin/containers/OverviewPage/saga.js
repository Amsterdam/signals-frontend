import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { push } from 'react-router-redux';
import { authCall } from '../../../../shared/services/api/api';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged } from './actions';

export function* fetchIncidents(action) {
  const requestURL = '/api/signals';

  try {
    const filter = action.payload;
    yield put(filterIncidentsChanged(filter));
    const incidents = yield authCall(requestURL, filter);

    // TODO: remove this
    yield call(delay, 500);
    yield put(requestIncidentsSuccess(incidents));
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

export function* openIncident(action) {
  const incident = action.payload;
  const navigateUrl = `incident/${incident.id}`;
  yield put(push(navigateUrl));
}

// Individual exports for testing
export default function* watchRequestIncidentsSaga() {
  yield [
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident)
  ];
}
