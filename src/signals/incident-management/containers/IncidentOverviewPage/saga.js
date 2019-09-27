/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

import {
  all,
  delay,
  put,
  select,
  call,
  race,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { makeSelectFilterParams, makeSelectFilter } from 'signals/incident-management/selectors';
import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  INCIDENT_SELECTED,
  REQUEST_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  pageIncidentsChanged,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  sortIncidentsChanged,
} from './actions';

export function* fetchIncidents(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

  try {
    const filter = action.payload.filter;

    if (filter) {
      yield put(applyFilterRefreshStop());
      // yield put(pageIncidentsChanged(1));
    }

    const page = action.payload.page;

    if (page) {
      yield put(pageIncidentsChanged(page));
    }

    const sort = action.payload.sort;

    if (sort) {
      yield put(sortIncidentsChanged(sort));
    }

    const params = yield select(makeSelectFilterParams());

    // TEMP remove when server can order days_open
    if (params.ordering === 'days_open') {
      params.ordering = '-created_at';
    } else if (params.ordering === '-days_open') {
      params.ordering = 'created_at';
    }

    const incidents = yield call(authCall, requestURL, params);

    yield put(requestIncidentsSuccess(incidents));

    yield put(applyFilterRefresh());
  } catch (error) {
    yield put(requestIncidentsError(error.message));
  }
}

export function* openIncident(action) {
  const incident = action.payload;
  const navigateUrl = `incident/${incident.id}`;
  yield put(push(navigateUrl));
}

export const refreshRequestDelay = 2 * 60 * 1000;

export function* refreshIncidents(timeout = refreshRequestDelay) {
  while (true) {
    const filter = yield select(makeSelectFilter);

    if (filter && filter.refresh) {
      yield delay(timeout);
      yield put(requestIncidents({ filter }));
    }
  }
}

export default function* watchRequestIncidentsSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident),
  ]);

  while (true) {
    yield take(APPLY_FILTER_REFRESH);
    yield race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)]);
  }
}
