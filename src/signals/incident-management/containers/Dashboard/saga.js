import { all, put, takeLatest } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
// import request from 'utils/request';

// import { authCall } from 'shared/services/api/api';
// import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  REQUEST_DASHBOARD
} from './constants';
import {
  requestDashboardSuccess
} from './actions';


export function* fetchDashboard() {
  // const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories/`;

  try {
    // const categories = yield call(request, requestURL);

    yield put(requestDashboardSuccess({
      status: [
        { name: 'Gemeld', value: 59, color: '#23B0C3' },
        { name: 'In afhandeling van behandeling', value: 7, color: '#E8663F' },
        { name: 'In behandeling', value: 20, color: '#FE952F' },
        { name: 'Geannuleerd', value: 2, color: '#96C14F' },
        { name: 'Afgehandeld', value: 13, color: '#9B4474' },
        { name: 'On hold', value: 1, color: '#E8663F' }
      ],
      category: [
        { name: 'Overlast op het water', value: 2 },
        { name: 'Overlast van dieren', value: 9 },
        { name: 'Overlast van en door personen en groepen', value: 9 },
        { name: 'Overlast bedrijven en horeca', value: 12 },
        { name: 'Openbaar groen en water', value: 28 },
        { name: 'Overlast in de openbare ruimte', value: 82 },
        { name: 'Overig', value: 88 },
        { name: 'Wegen verkeer straatmeubileir ', value: 126 },
        { name: 'Afval', value: 213 }
      ],
      hour: [
        { hour: 0, value: 4 },
        { hour: 1, value: 3 },
        { hour: 2, value: 1 },
        { hour: 3, value: 4 },
        { hour: 4, value: 8 },
        { hour: 5, value: 42 },
        { hour: 6, value: 70 },
        { hour: 7, value: 60 },
        { hour: 8, value: 93 },
        { hour: 9, value: 137 },
        { hour: 10, value: 64 },
        { hour: 11, value: 71 },
        { hour: 12, value: 12 }
      ]
    }));
  } catch (err) {
    // yield put(showGlobalError('FETCH_CATEGORIES_FAILED'));
  }
}

export default function* watchDashboardSaga() {
  yield all([
    takeLatest(REQUEST_DASHBOARD, fetchDashboard)
  ]);
}
