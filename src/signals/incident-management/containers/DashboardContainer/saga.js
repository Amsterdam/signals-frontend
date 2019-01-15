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

export function* fetchDashboard() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/experimental/dashboards/1/`;

  try {
    const dashboard = yield authCall(requestURL);
    // const dashboard = {
    //   status: [
    //     { name: 'Gemeld', count: Math.trunc(Math.random() * 57), color: '#23B0C3' },
    //     { name: 'In afhandeling van behandeling', count: 7, color: '#E8663F' },
    //     { name: 'In behandeling', count: 20, color: '#FE952F' },
    //     { name: 'Geannuleerd', count: 2, color: '#96C14F' },
    //     { name: 'Afgehandeld', count: 13, color: '#9B4474' },
    //     { name: 'On hold', count: 1, color: '#E8663F' }
    //   ],
    //   category: [
    //     { name: 'Overlast op het water', count: 2 },
    //     { name: 'Overlast van dieren', count: 9 },
    //     { name: 'Overlast van en door personen en groepen', count: 9 },
    //     { name: 'Overlast bedrijven en horeca', count: 12 },
    //     { name: 'Openbaar groen en water', count: 28 },
    //     { name: 'Overlast in de openbare ruimte', count: 82 },
    //     { name: 'Overig', count: 88 },
    //     { name: 'Wegen verkeer straatmeubileir ', count: 126 },
    //     { name: 'Afval', count: Math.trunc(Math.random() * 250) }
    //   ],
    //   hour: [
    //     { hour: 0, count: Math.trunc(Math.random() * 70) },
    //     { hour: 1, count: Math.trunc(Math.random() * 70) },
    //     { hour: 2, count: Math.trunc(Math.random() * 70) },
    //     { hour: 3, count: Math.trunc(Math.random() * 70) },
    //     { hour: 4, count: 8 },
    //     { hour: 5, count: 42 },
    //     { hour: 6, count: 70 },
    //     { hour: 7, count: 60 },
    //     { hour: 8, count: 93 },
    //     { hour: 9, count: 137 },
    //     { hour: 10, count: 64 },
    //     { hour: 11, count: 71 },
    //     { hour: 12, count: 12 }
    //   ],
    //   today: { count: Math.trunc(Math.random() * 700) }
    // };

    yield put(requestDashboardSuccess(dashboard));
  } catch (error) {
    yield put(requestDashboardError(error));
  }
}

export default function* watchDashboardSaga() {
  yield takeLatest(REQUEST_DASHBOARD, fetchDashboard);
}
