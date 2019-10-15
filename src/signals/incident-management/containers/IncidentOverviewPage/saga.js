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
import { push } from 'connected-react-router/immutable';

import { authCall, authDeleteCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  APPLY_FILTER,
  GET_FILTERS,
  INCIDENT_SELECTED,
  REMOVE_FILTER,
  REQUEST_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  filterIncidentsChanged,
  getFiltersFailed,
  getFiltersSuccess,
  pageIncidentsChanged,
  removeFilterFailed,
  removeFilterSuccess,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  sortIncidentsChanged,
} from './actions';
import { makeSelectFilterParams, makeSelectFilter } from './selectors';

import { resetSearchQuery } from '../../../../models/search/actions';

export function* fetchIncidents(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

  try {
    const filter = action.payload.filter;

    if (filter) {
      yield put(applyFilterRefreshStop());
      yield put(filterIncidentsChanged(filter));
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
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

export function* openIncident(action) {
  const incident = action.payload;
  const navigateUrl = `incident/${incident.id}`;
  yield put(push(navigateUrl));
}

export function* getFilters() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/`;

  try {
    const result = yield call(authCall, requestURL);

    yield put(getFiltersSuccess(result.results));
  } catch (error) {
    yield put(getFiltersFailed(error));
  }
}

export function* removeFilter(action) {
  const id = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/${id}`;

  try {
    yield call(authDeleteCall, requestURL);
    yield put(removeFilterSuccess(id));
  } catch (error) {
    yield put(removeFilterFailed());
  }
}

export function* applyFilter(action) {
  const filter = action.payload;
  yield put(resetSearchQuery());
  yield put(requestIncidents({ filter }));
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
    takeLatest(GET_FILTERS, getFilters),
    takeLatest(REMOVE_FILTER, removeFilter),
    takeLatest(APPLY_FILTER, applyFilter),
  ]);

  while (true) {
    yield take(APPLY_FILTER_REFRESH);
    yield race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)]);
  }
}
