import { all, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { authCall, authDeleteCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  REQUEST_INCIDENTS,
  INCIDENT_SELECTED,
  GET_FILTERS,
  REMOVE_FILTER,
  APPLY_FILTER,
} from './constants';
import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  filterIncidentsChanged,
  pageIncidentsChanged,
  sortIncidentsChanged,
  getFiltersSuccess,
  getFiltersFailed,
  removeFilterSuccess,
  removeFilterFailed,
} from './actions';
import { makeSelectFilterParams } from './selectors';

import { resetSearchQuery } from '../../../../models/search/actions';

export function* fetchIncidents(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

  try {
    const filter = action.payload.filter;
    if (filter) yield put(filterIncidentsChanged(filter));
    const page = action.payload.page;
    if (page) yield put(pageIncidentsChanged(page));
    const sort = action.payload.sort;
    if (sort) yield put(sortIncidentsChanged(sort));
    const params = yield select(makeSelectFilterParams());

    // TEMP remove when server can order days_open
    if (params.ordering === 'days_open') {
      params.ordering = '-created_at';
    } else if (params.ordering === '-days_open') {
      params.ordering = 'created_at';
    }

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

export function* getFilters() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/`;

  try {
    const result = yield authCall(requestURL);

    yield put(getFiltersSuccess(result.results));
  } catch (error) {
    yield put(getFiltersFailed(error));
  }
}

export function* removeFilter(action) {
  const id = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/${id}`;

  try {
    yield authDeleteCall(requestURL);
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

export default function* watchRequestIncidentsSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident),
    takeLatest(GET_FILTERS, getFilters),
    takeLatest(REMOVE_FILTER, removeFilter),
    takeLatest(APPLY_FILTER, applyFilter),
  ]);
}
