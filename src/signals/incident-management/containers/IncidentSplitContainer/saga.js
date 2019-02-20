import { put, takeLatest } from 'redux-saga/effects';
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
    const created = yield authPostCall(`${requestURL}/${payload.incident.id}/split`, payload.create);
    if (created && created.children && Array.isArray(created.children)) {
      yield authPatchCall(`${requestURL}/${created.children[0].id}`, formatUpdateIncident(payload.update[0]));
      yield authPatchCall(`${requestURL}/${created.children[1].id}`, formatUpdateIncident(payload.update[1]));
      if (created.children[2] && created.children[2].id && payload.update[2]) {
        yield authPatchCall(`${requestURL}/${created.children[2].id}`, formatUpdateIncident(payload.update[2]));
      }
    }
    yield put(splitIncidentSuccess({ id: payload.incident.id, created }));
    yield put(push(`/manage/incident/${payload.incident.id}`));
  } catch (error) {
    yield put(splitIncidentError(error));
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
