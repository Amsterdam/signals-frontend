import { all, put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall } from 'shared/services/api/api';

import { FETCH_DEFAULT_TEXTS } from './constants';
import { fetchDefaultTextsSuccess, fetchDefaultTextsError } from './actions';

// signals/v1/public/terms/categories/afval/status-message-templates

export function* fetchDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories`;
  try {
    const payload = action.payload;
    console.log('saga state', payload.state);
    const incident = yield authCall(`${requestURL}/${payload.subcategory}/state-message-templates/`);
    yield put(fetchDefaultTextsSuccess(incident));
  } catch (error) {
    yield put(fetchDefaultTextsError(error));
  }
}

export default function* watchDefaultTextsAdminSaga() {
  yield all([
    takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts)
  ]);
}
