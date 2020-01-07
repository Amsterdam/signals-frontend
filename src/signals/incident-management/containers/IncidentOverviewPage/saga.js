// /* eslint no-constant-condition: ["error", { "checkLoops": false }] */

// import {
//   all,
//   delay,
//   put,
//   select,
//   call,
//   race,
//   take,
//   takeLatest,
// } from 'redux-saga/effects';

// import { authCall } from 'shared/services/api/api';
// import CONFIGURATION from 'shared/services/configuration/configuration';

// import {
//   makeSelectFilterParams,
//   makeSelectActiveFilter,
// } from 'signals/incident-management/selectors';
// import {
//   PAGE_INCIDENTS_CHANGED,
//   PAGE_SEARCH_CHANGED,
//   ORDERING_INCIDENTS_CHANGED,
// } from 'signals/incident-management/constants';
// import {
//   APPLY_FILTER_REFRESH_STOP,
//   APPLY_FILTER_REFRESH,
//   REQUEST_INCIDENTS,
//   SEARCH_INCIDENTS,
// } from './constants';
// import {
//   applyFilterRefresh,
//   applyFilterRefreshStop,
//   requestIncidents,
//   requestIncidentsError,
//   requestIncidentsSuccess,
// } from './actions';

// export function* fetchIncidents() {
//   try {
//     const filter = yield select(makeSelectActiveFilter);

//     if (filter && filter.refresh) {
//       yield put(applyFilterRefreshStop());
//     }

//     const params = yield select(makeSelectFilterParams);

//     const incidents = yield call(
//       authCall,
//       CONFIGURATION.INCIDENTS_ENDPOINT,
//       params
//     );

//     yield put(requestIncidentsSuccess(incidents));

//     if (filter && filter.refresh) {
//       yield put(applyFilterRefresh());
//     }
//   } catch (error) {
//     yield put(requestIncidentsError(error.message));
//   }
// }

// export function* searchIncidents(action) {
//   const { payload } = action;

//   try {
//     yield put(applyFilterRefreshStop());

//     const params = yield select(makeSelectFilterParams);

//     const incidents = yield call(authCall, CONFIGURATION.SEARCH_ENDPOINT, {
//       q: payload,
//       ...params,
//     });

//     yield put(requestIncidentsSuccess(incidents));
//   } catch (error) {
//     if (
//       error.response &&
//       error.response.status === 500
//     ) {
//       // Getting an error response with status code 500 from the search endpoint
//       // means that the Elasticsearch index is very likely corrupted. In that
//       // case we simulate a success response without results.
//       yield put(requestIncidentsSuccess({ count: 0, results: [] }));
//     }

//     yield put(requestIncidentsError(error.message));
//   }
// }

// export const refreshRequestDelay = 2 * 60 * 1000;

// export function* refreshIncidents(timeout = refreshRequestDelay) {
//   while (true) {
//     const filter = yield select(makeSelectActiveFilter);

//     if (filter && filter.refresh) {
//       yield delay(timeout);
//       yield put(requestIncidents());
//     } else {
//       break;
//     }
//   }
// }

// export default function* watchRequestIncidentsSaga() {
//   yield all([
//     takeLatest(SEARCH_INCIDENTS, searchIncidents),
//     takeLatest(PAGE_SEARCH_CHANGED, searchIncidents),
//     takeLatest(REQUEST_INCIDENTS, fetchIncidents),
//     takeLatest(PAGE_INCIDENTS_CHANGED, fetchIncidents),
//     takeLatest(ORDERING_INCIDENTS_CHANGED, fetchIncidents),
//   ]);

//   while (true) {
//     yield take(APPLY_FILTER_REFRESH);
//     yield race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)]);
//   }
// }
