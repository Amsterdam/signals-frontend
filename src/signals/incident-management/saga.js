import { all, put, call, spawn, takeLatest } from 'redux-saga/effects';

import {
  authCall,
  authDeleteCall,
  authPatchCall,
  authPostCall,
} from 'shared/services/api/api';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { resetSearchQuery } from 'models/search/actions';

import {
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
  getFilters,
  getFiltersFailed,
  getFiltersSuccess,
  removeFilterFailed,
  removeFilterSuccess,
} from './actions';

import {
  APPLY_FILTER,
  GET_FILTERS,
  REMOVE_FILTER,
  SAVE_FILTER,
  UPDATE_FILTER,
} from './constants';

export const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/`;

export function* fetchFilters() {
  try {
    const result = yield call(authCall, requestURL);

    yield put(getFiltersSuccess(result.results));
  } catch (error) {
    yield put(getFiltersFailed(error.message));
  }
}

export function* removeFilter(action) {
  const id = action.payload;

  try {
    yield call(authDeleteCall, `${requestURL}${id}`);
    yield put(removeFilterSuccess(id));
  } catch (error) {
    yield put(removeFilterFailed(error.message));
  }
}

export function* applyFilter() {
  yield put(resetSearchQuery());
}

export function* doSaveFilter(action) {
  const filterData = action.payload;

  try {
    yield put(resetSearchQuery());

    if (filterData.name) {
      const result = yield call(authPostCall, requestURL, filterData);

      yield put(filterSaveSuccess(result));
      yield put(getFilters());
    } else {
      yield put(filterSaveFailed('No name supplied'));
    }
  } catch (error) {
    if (
      error.response
      && error.response.status >= 400
      && error.response.status < 500
    ) {
      yield put(filterSaveFailed('Invalid data supplied'));
    } else if (error.response && error.response.status >= 500) {
      yield put(filterSaveFailed('Internal server error'));
    } else {
      yield put(filterSaveFailed(error));
    }
  }
}

export function* doUpdateFilter(action) {
  const {
    name, refresh, id, options,
  } = action.payload;

  try {
    const result = yield call(authPatchCall, `${requestURL}${id}`, {
      name,
      refresh,
      options,
    });

    yield put(filterUpdatedSuccess(result));
    yield put(getFilters());
    yield put(resetSearchQuery());
  } catch (error) {
    if (
      error.response
      && error.response.status >= 400
      && error.response.status < 500
    ) {
      yield put(filterUpdatedFailed('Invalid data supplied'));
    } else if (error.response && error.response.status >= 500) {
      yield put(filterUpdatedFailed('Internal server error'));
    } else {
      yield put(filterUpdatedFailed(error));
    }
  }
}

export function* saveFilter(action) {
  yield spawn(doSaveFilter, action);
}

export function* updateFilter(action) {
  yield spawn(doUpdateFilter, action);
}

export default function* watchIncidentManagementSaga() {
  yield all([
    takeLatest(GET_FILTERS, fetchFilters),
    takeLatest(REMOVE_FILTER, removeFilter),
    takeLatest(APPLY_FILTER, applyFilter),
    takeLatest(SAVE_FILTER, saveFilter),
    takeLatest(UPDATE_FILTER, updateFilter),
  ]);
}
