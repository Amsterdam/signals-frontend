/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

import {
  all,
  delay,
  put,
  select,
  call,
  race,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  makeSelectFilterParams,
  makeSelectActiveFilter,
} from 'signals/incident-management/selectors';
import {
  PAGE_INCIDENTS_CHANGED,
  ORDERING_INCIDENTS_CHANGED,
} from 'signals/incident-management/constants';
import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  INCIDENT_SELECTED,
  REQUEST_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
} from './actions';

export function* fetchIncidents() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

  try {
    const filter = yield select(makeSelectActiveFilter);

    if (filter && filter.refresh) {
      yield put(applyFilterRefreshStop());
    }

    const params = yield select(makeSelectFilterParams);

    const incidents = yield call(authCall, requestURL, params);

    yield put(requestIncidentsSuccess(incidents));

    if (filter && filter.refresh) {
      yield put(applyFilterRefresh());
    }
  } catch (error) {
    yield put(requestIncidentsError(error.message));
  }
}

export function* openIncident(action) {
  const incident = action.payload;
  const navigateUrl = `incident/${incident.id}`;
  yield put(push(navigateUrl));
}

export const refreshRequestDelay = 2 * 60 * 1000;

export function* refreshIncidents(timeout = refreshRequestDelay) {
  while (true) {
    const filter = yield select(makeSelectActiveFilter);

    if (filter && filter.refresh) {
      yield delay(timeout);
      yield put(requestIncidents());
    } else {
      break;
    }
  }
}

export default function* watchRequestIncidentsSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident),
    takeLatest(PAGE_INCIDENTS_CHANGED, fetchIncidents),
    takeLatest(ORDERING_INCIDENTS_CHANGED, fetchIncidents),
  ]);

  while (true) {
    yield take(APPLY_FILTER_REFRESH);
    yield race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)]);
  }
}
