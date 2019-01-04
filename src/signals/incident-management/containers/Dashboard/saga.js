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

    yield put(requestDashboardSuccess([
      { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
      { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
      { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
      { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
      { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
      { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
      { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
    ]));
  } catch (err) {
    // yield put(showGlobalError('FETCH_CATEGORIES_FAILED'));
  }
}

export default function* watchDashboardSaga() {
  yield all([
    takeLatest(REQUEST_DASHBOARD, fetchDashboard)
  ]);
}
