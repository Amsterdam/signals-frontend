import { all, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import CONFIGURATION from 'shared/services/configuration/configuration';

import formatUpdateIncident from './services/formatUpdateIncident';
import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import { authPatchCall, authPostCall } from '../../../../shared/services/api/api';

export function* splitIncident(action) {
  const payload = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  try {
    const created = yield authPostCall(`${requestURL}/${payload.id}/split`, payload.create);
    yield all(created.children.map((child, key) => authPatchCall(`${requestURL}/${child.id}`, formatUpdateIncident(payload.update[key]))));
    yield put(splitIncidentSuccess({ id: payload.id, created }));
    yield put(push(`/manage/incident/${payload.id}`));
  } catch (error) {
    yield put(splitIncidentError(error));
    yield put(push(`/manage/incident/${payload.id}`));
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
