import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { push } from 'connected-react-router/immutable';

import { authPatchCall, authPostCall, getErrorMessage } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import formatUpdateIncident from './services/formatUpdateIncident';
import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';

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

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De melding kon niet gesplitst worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    yield call([Sentry, 'captureException'], error);
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
