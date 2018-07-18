import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import watchAppSaga, { callLogin, callLogout } from './saga';
import { LOGIN, LOGOUT } from './constants';
import { showGlobalError } from './actions';

jest.mock('../../shared/services/auth/auth');

describe('App saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchAppSaga', () => {
    const gen = watchAppSaga();
    expect(gen.next().value).toEqual([takeLatest(LOGIN, callLogin), takeLatest(LOGOUT, callLogout)]); // eslint-disable-line redux-saga/yield-effects
  });

  it('should logout success', () => {
    const gen = callLogout();
    expect(gen.next().value).toEqual(put(push('/'))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should logout error', () => {
    const error = new Error('Logout error');
    const gen = callLogout();
    gen.next();
    expect(gen.throw(error).value).toEqual(put(showGlobalError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
