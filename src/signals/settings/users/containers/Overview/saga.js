import { call } from 'redux-saga/effects';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

export function* fetchUsers() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/users/`;

  try {
    const results = yield call(authCall, requestURL);

    return results;
  } catch (error) {
    return error;
    // yield put(requestUsersError(error.message));
  }
}

// export default function* watchRequestUsersSaga() {
//   yield all([
//     takeLatest(REQUEST_USERS, fetchUsers),
//   ]);
// }
