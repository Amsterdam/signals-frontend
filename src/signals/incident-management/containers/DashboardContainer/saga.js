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
        // {
            // "interval_start": "2019-01-21T14:00:00",
            // "hour": 14,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T15:00:00",
            // "hour": 15,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T16:00:00",
            // "hour": 16,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T17:00:00",
            // "hour": 17,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T18:00:00",
            // "hour": 18,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T19:00:00",
            // "hour": 19,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T20:00:00",
            // "hour": 20,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T21:00:00",
            // "hour": 21,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T22:00:00",
            // "hour": 22,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-21T23:00:00",
            // "hour": 23,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T00:00:00",
            // "hour": 0,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T01:00:00",
            // "hour": 1,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T02:00:00",
            // "hour": 2,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T03:00:00",
            // "hour": 3,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T04:00:00",
            // "hour": 4,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T05:00:00",
            // "hour": 5,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T06:00:00",
            // "hour": 6,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T07:00:00",
            // "hour": 7,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T08:00:00",
            // "hour": 8,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T09:00:00",
            // "hour": 9,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T10:00:00",
            // "hour": 10,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T11:00:00",
            // "hour": 11,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T12:00:00",
            // "hour": 12,
            // "count": Math.trunc(Math.random() * 250)
        // },
        // {
            // "interval_start": "2019-01-22T13:00:00",
            // "hour": 13,
              // "count": Math.trunc(Math.random() * 250)
        // }
      // ],
      // total: Math.trunc(Math.random() * 700)
    // };

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
