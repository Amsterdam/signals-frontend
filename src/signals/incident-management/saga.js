import { all, put, call, takeLatest } from 'redux-saga/effects';

import { authCall, authDeleteCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { resetSearchQuery } from 'models/search/actions';
import { requestIncidents } from 'signals/incident-management/containers/IncidentOverviewPage/actions';

import {
  getFiltersFailed,
  getFiltersSuccess,
  removeFilterFailed,
  removeFilterSuccess,
} from './actions';
import { GET_FILTERS, REMOVE_FILTER, APPLY_FILTER } from './constants';

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

export default function* watchIncidentManagementSaga() {
  yield all([
    takeLatest(GET_FILTERS, getFilters),
    takeLatest(REMOVE_FILTER, removeFilter),
    takeLatest(APPLY_FILTER, applyFilter),
  ]);
}
