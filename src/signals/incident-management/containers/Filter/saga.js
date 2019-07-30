import { put, takeLatest } from 'redux-saga/effects';

import { authPostCall } from 'shared/services/api/api';

import { SAVE_FILTER } from './constants';
import { filterSaveFailed, filterSaveSuccess } from './actions';

const requestURL = '/signals/user/auth/me/filters';

export function* saveFilter(action) {
  const filterData = action.payload;

  try {
    if (filterData.name) {
      yield put(filterSaveSuccess(filterData));
      const result = yield authPostCall(requestURL, filterData);

      yield put(filterSaveSuccess(result));
    } else {
      yield put(filterSaveFailed('No name supplied'));
    }
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      yield put(filterSaveFailed('Invalid data supplied'));
    } else if (error.response && error.response.status >= 500) {
      yield put(filterSaveFailed('Internal server error'));
    } else {
      yield put(filterSaveFailed(error));
    }
  }
}

export default function* watchFilterSaga() {
  yield takeLatest(SAVE_FILTER, saveFilter);
}
