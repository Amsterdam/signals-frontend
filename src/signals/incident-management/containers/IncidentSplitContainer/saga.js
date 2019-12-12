import { all, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';

import CONFIGURATION from 'shared/services/configuration/configuration';

import formatUpdateIncident from './services/formatUpdateIncident';
import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import {
  authPatchCall,
  authPostCall,
} from '../../../../shared/services/api/api';

export function* splitIncident(action) {
  const payload = action.payload;
  try {
    const created = yield authPostCall(
      `${CONFIGURATION.INCIDENTS_ENDPOINT}${payload.id}/split`,
      payload.create
    );
    yield all(
      created.children.map((child, key) =>
        authPatchCall(
          `${CONFIGURATION.INCIDENTS_ENDPOINT}${child.id}`,
          formatUpdateIncident(payload.update[key])
        )
      )
    );
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
