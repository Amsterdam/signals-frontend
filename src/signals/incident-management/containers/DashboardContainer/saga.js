import { all, put, takeLatest } from 'redux-saga/effects';
import pullAllBy from 'lodash.pullallby';
import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  REQUEST_DASHBOARD,
  UPDATE_DASHBOARD,
} from './constants';
import {
  requestDashboardSuccess,
  requestDashboardError,
} from './actions';

export const requestURL = CONFIGURATION.DASHBOARD_ENDPOINT;

export function* fetchDashboard() {
  try {
    const dashboard = yield authCall(requestURL);

    dashboard.hour = dashboard.hour.map(item => ({
      ...item,
      timestamp: new Date(item.interval_start).getTime(),
    }));

    // TEMP: remove these items
    pullAllBy(dashboard.status, [
      { name: 'Melding is afgehandeld in extern systeem' },
      { name: 'Te verzenden naar extern systeem' },
      { name: 'Verzending naar extern systeem mislukt' },
      { name: 'Verzonden naar extern systeem' },
    ], 'name');

    yield put(requestDashboardSuccess(dashboard));
  } catch (error) {
    yield put(requestDashboardError(error));
  }
}

export default function* watchDashboardSaga() {
  yield all([
    takeLatest(REQUEST_DASHBOARD, fetchDashboard),
    takeLatest(UPDATE_DASHBOARD, fetchDashboard),
  ]);
}
