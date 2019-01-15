import { put, takeLatest } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
// import request from 'utils/request';

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
    // const dashboard = {
      // status: [
        // { name: 'Gemeld', count: Math.trunc(Math.random() * 57), color: '#23B0C3' },
        // { name: 'In afhandeling van behandeling', count: 7, color: '#E8663F' },
        // { name: 'In behandeling', count: 20, color: '#FE952F' },
        // { name: 'Geannuleerd', count: 2, color: '#96C14F' },
        // { name: 'Afgehandeld', count: 13, color: '#9B4474' },
        // { name: 'On hold', count: 1, color: '#E8663F' }
      // ],
      // category: [
        // { name: 'Overlast op het water', count: 2 },
        // { name: 'Overlast van dieren', count: 9 },
        // { name: 'Overlast van en door personen en groepen', count: 9 },
        // { name: 'Overlast bedrijven en horeca', count: 12 },
        // { name: 'Openbaar groen en water', count: 28 },
        // { name: 'Overlast in de openbare ruimte', count: 82 },
        // { name: 'Overig', count: 88 },
        // { name: 'Wegen verkeer straatmeubileir ', count: 126 },
        // { name: 'Afval', count: Math.trunc(Math.random() * 250) }
      // ],
      // hour: [
        // { dateTime: '2019-01-15T05:00:00+01:00', count: Math.trunc(Math.random() * 70) },
        // { dateTime: '2019-01-15T06:00:00+01:00', count: Math.trunc(Math.random() * 70) },
        // { dateTime: '2019-01-15T07:00:00+01:00', count: Math.trunc(Math.random() * 70) },
        // { dateTime: '2019-01-15T08:00:00+01:00', count: Math.trunc(Math.random() * 70) },
        // { dateTime: '2019-01-15T09:00:00+01:00', count: 8 },
        // { dateTime: '2019-01-15T10:00:00+01:00', count: 42 },
        // { dateTime: '2019-01-15T11:00:00+01:00', count: 70 },
        // { dateTime: '2019-01-15T12:00:00+01:00', count: 60 },
        // { dateTime: '2019-01-15T13:00:00+01:00', count: 93 },
        // { dateTime: '2019-01-15T14:00:00+01:00', count: 137 },
        // { dateTime: '2019-01-15T15:00:00+01:00', count: 64 },
        // { dateTime: '2019-01-15T16:00:00+01:00', count: 71 },
        // { dateTime: '2019-01-15T17:00:00+01:00', count: 12 }
      // ],
      // today: { count: Math.trunc(Math.random() * 700) }
    // };

    dashboard.hour = dashboard.hour.map((item) => ({
      ...item,
      timestamp: new Date(item.dateTime).getTime()
    }));

    yield put(requestDashboardSuccess(dashboard));
  } catch (error) {
    yield put(requestDashboardError(error));
  }
}

export default function* watchDashboardSaga() {
  yield takeLatest(REQUEST_DASHBOARD, fetchDashboard);
}
