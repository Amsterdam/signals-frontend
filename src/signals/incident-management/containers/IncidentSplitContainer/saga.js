import { put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import { authPostCall } from '../../../../shared/services/api/api';

export function* splitIncident(action) {
  const payload = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  try {
    console.log('saga', payload);
    const created = yield authPostCall(`${requestURL}/${payload.id}/split`, payload.create);

    console.log('saga2', created);

    yield put(splitIncidentSuccess(created));
  } catch (error) {
    yield put(splitIncidentError(error));
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
