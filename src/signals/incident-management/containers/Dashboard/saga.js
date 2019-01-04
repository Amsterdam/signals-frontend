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
      pie1: [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 }
      ],
      pie2: [
        { name: 'A1', value: 100 },
        { name: 'A2', value: 300 },
        { name: 'B1', value: 100 },
        { name: 'B2', value: 80 },
        { name: 'B3', value: 40 },
        { name: 'B4', value: 30 },
        { name: 'B5', value: 50 },
        { name: 'C1', value: 100 },
        { name: 'C2', value: 200 },
        { name: 'D1', value: 150 },
        { name: 'D2', value: 50 }
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
