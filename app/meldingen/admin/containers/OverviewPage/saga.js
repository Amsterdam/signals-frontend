import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { push } from 'react-router-redux';
import request from 'utils/request';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged } from './actions';

export function* fetchIncidents(action) {
  const requestURL = '/api/signals';

  try {
    const { filter } = action;
    yield put(filterIncidentsChanged(filter));
    const incidents = yield call(request, requestURL, filter);
    yield call(delay, 1000);
    yield put(requestIncidentsSuccess(incidents));
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

export function* openIncident(action) {
  const { incident } = action;
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
