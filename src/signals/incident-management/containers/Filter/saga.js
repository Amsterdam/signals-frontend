import { all, call, put, spawn, takeLatest } from 'redux-saga/effects';

import { authPostCall, authPatchCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { SAVE_FILTER, UPDATE_FILTER } from './constants';
import {
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
} from './actions';
import { getFilters } from '../IncidentOverviewPage/actions';

export const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/me/filters/`;

export function* doSaveFilter(action) {
  const filterData = action.payload;

  try {
    if (filterData.name) {
      const result = yield call(authPostCall, requestURL, filterData);

      yield put(filterSaveSuccess(result));
      yield put(getFilters());
    } else {
      yield put(filterSaveFailed('No name supplied'));
    }
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
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
  const { name, options: { id, ...options } } = action.payload;

  try {
    const result = yield call(authPatchCall, `${requestURL}${id}`, { name, options });

    yield put(filterUpdatedSuccess(result));
    yield put(getFilters());
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
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

export default function* watchFilterSaga() {
  yield all([
    takeLatest(SAVE_FILTER, saveFilter),
    takeLatest(UPDATE_FILTER, updateFilter),
  ]);
}
