// import { splitIncident } from "./actions";

import { takeLatest } from 'redux-saga/effects';

// import CONFIGURATION from 'shared/services/configuration/configuration';

import { SPLIT_INCIDENT } from './constants';
// import { requestIncidentSuccess, requestIncidentError } from './actions';
// import { authCall } from '../../../../shared/services/api/api';

export function* splitIncident() {
//   const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/signal`;
//   try {
//     const id = action.payload;
//     const incident = yield authCall(`${requestURL}/${id}/`);
//     yield put(requestIncidentSuccess(incident));
//   } catch (err) {
//     yield put(requestIncidentError(err));
//   }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
