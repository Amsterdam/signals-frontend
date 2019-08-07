import { all, call, put, takeLatest } from 'redux-saga/effects';

import { authPostCall, authPatchCall } from 'shared/services/api/api';

import { SAVE_FILTER, UPDATE_FILTER } from './constants';
import {
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
} from './actions';

export const requestURL = '/signals/v1/private/me/filters';

export function* saveFilter(action) {
  const filterData = action.payload;

  try {
    if (filterData.name) {
      const result = yield call(authPostCall, requestURL, filterData);

      yield put(filterSaveSuccess(result));
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

export function* updateFilter(action) {
  const filterData = action.payload;

  try {
    const result = yield call(authPatchCall, requestURL, filterData);

    yield put(filterUpdatedSuccess(result));
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

export default function* watchFilterSaga() {
  yield all([
    takeLatest(SAVE_FILTER, saveFilter),
    takeLatest(UPDATE_FILTER, updateFilter),
  ]);
}
