import { testSaga } from 'redux-saga-test-plan';
import { takeLatest } from 'redux-saga/effects';
// import { throwError } from 'redux-saga-test-plan/providers';

import {
  FETCH_ROLES,
  SAVE_ROLE,
  PATCH_ROLE,
} from './constants';

import {
// fetchRolesSuccess,
// fetchRolesError,
// saveRoleSuccess,
// saveRoleError,
// patchRoleSuccess,
// patchRoleError,
} from './actions';

import watchRolesSaga, {
  fetchRoles,
  saveRole,
  patchRole,
} from './saga';

describe('', () => {
  it('should watch incidentModelSaga', () => {
    testSaga(watchRolesSaga)
      .next()
      .all([
        takeLatest(FETCH_ROLES, fetchRoles),
        takeLatest(SAVE_ROLE, saveRole),
        takeLatest(PATCH_ROLE, patchRole),
      ])
      .next()
      .isDone();
  });
})

