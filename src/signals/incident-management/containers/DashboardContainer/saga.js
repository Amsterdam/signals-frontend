import { put, takeLatest } from 'redux-saga/effects';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  REQUEST_DASHBOARD
} from './constants';
import {
  requestDashboardSuccess,
  requestDashboardError
} from './actions';

export const requestURL = `${CONFIGURATION.API_ROOT}signals/experimental/dashboards/1`;

export function* fetchDashboard() {
  try {
    const dashboard = yield authCall(requestURL);

    dashboard.hour = dashboard.hour.map((item) => ({
      ...item,
      timestamp: new Date(item.interval_start).getTime()
    }));

    yield put(requestDashboardSuccess(dashboard));
  } catch (error) {
    yield put(requestDashboardError(error));
  }
}

export default function* watchDashboardSaga() {
  yield takeLatest(REQUEST_DASHBOARD, fetchDashboard);
}
