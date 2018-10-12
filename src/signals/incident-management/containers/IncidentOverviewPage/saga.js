import { all, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged, pageIncidentsChanged, sortIncidentsChanged } from './actions';
import { makeSelectFilterParams } from './selectors';

export function* fetchIncidents(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/signal`;

  try {
    const filter = action.payload.filter;
    if (filter) yield put(filterIncidentsChanged(filter));
    const page = action.payload.page;
    if (page) yield put(pageIncidentsChanged(page));
    const sort = action.payload.sort;
    if (sort) yield put(sortIncidentsChanged(sort));
    const params = yield select(makeSelectFilterParams());
    const incidents = yield authCall(requestURL, params);

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

export default function* watchRequestIncidentsSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident)
  ]);
}
