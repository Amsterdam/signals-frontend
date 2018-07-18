import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import watchAppSaga, { logout } from './saga';
import { LOGOUT } from './constants';
import { showGlobalError } from './actions';

describe('App saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchAppSaga', () => {
    const gen = watchAppSaga();
    expect(gen.next().value).toEqual(takeLatest(LOGOUT, logout)); // eslint-disable-line redux-saga/yield-effects
  });

  it('should logout success', () => {
    const gen = logout();
    expect(gen.next().value).toEqual(put(push('/'))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should logout error', () => {
    const error = new Error('Logout error');
    const gen = logout();
    gen.next();
    expect(gen.throw(error).value).toEqual(put(showGlobalError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
