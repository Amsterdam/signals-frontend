import { testSaga } from 'redux-saga-test-plan';
import { takeLatest } from 'redux-saga/effects';
import { authCall, authPostCall, authPatchCall } from 'shared/services/api/api';

import {
  FETCH_ROLES,
  SAVE_ROLE,
  PATCH_ROLE,
} from './constants';

import {
  fetchRolesSuccess,
  fetchRolesError,
  saveRoleSuccess,
  saveRoleError,
  patchRoleSuccess,
  patchRoleError,
} from './actions';

import watchRolesSaga, {
  fetchRoles,
  saveRole,
  patchRole,
} from './saga';

describe('rolesSaga', () => {
  const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/roles/';
  const result = { id: 42 };
  const action = { payload: result };

  it('should watch rolesSaga', () => {
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

  describe('fetchRoles', () => {
    it('should dispatch success', () => {
      const listResult = { results: [{ id: 42 }, { id: 43 }] };

      testSaga(fetchRoles)
        .next()
        .call(authCall, requestURL)
        .next(listResult)
        .put(fetchRolesSuccess(listResult.results))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('Something bad happened');

      testSaga(fetchRoles)
        .next()
        .throw(error)
        .put(fetchRolesError())
        .next()
        .isDone();
    });
  });

  describe('saveRole', () => {
    it('should dispatch success', () => {
      testSaga(saveRole, action)
        .next()
        .call(authPostCall, requestURL, result)
        .next(result)
        .put(saveRoleSuccess(result))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('Something bad happened');

      testSaga(saveRole, action)
        .next()
        .throw(error)
        .put(saveRoleError())
        .next()
        .isDone();
    });
  });

  describe('patchRole', () => {
    const requestPatchURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/roles/42';
    const patchAction = {
      payload: {
        id: 42,
        patch: result,
      },
    }

    it('should dispatch success', () => {
      testSaga(patchRole, patchAction)
        .next()
        .call(authPatchCall, requestPatchURL, result)
        .next(result)
        .put(patchRoleSuccess(result))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('Something bad happened');

      testSaga(patchRole, patchAction)
        .next()
        .throw(error)
        .put(patchRoleError())
        .next()
        .isDone();
    });
  });
});
