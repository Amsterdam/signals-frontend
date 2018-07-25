import { testActionCreator } from '../../../internals/testing/test-utils';

import {
  AUTHENTICATE_USER, AUTHORIZE_USER, SHOW_GLOBAL_ERROR, LOGIN, LOGOUT
} from './constants';

import {
  authenticateUser,
  authorizeUser,
  showGlobalError,
  doLogin,
  doLogout
} from './actions';


describe('App actions', () => {
  it('should create authenticate user', () => {
    const userName = 'name';
    const userScopes = 'scopes';
    const accessToken = 'token';
    const payload = {
      userName,
      userScopes,
      accessToken
    };
    testActionCreator(authenticateUser, AUTHENTICATE_USER, payload);
    testActionCreator(authorizeUser, AUTHORIZE_USER, payload);
  });

  it('should create show global error action', () => {
    const error = 'global error';
    const payload = error;
    testActionCreator(showGlobalError, SHOW_GLOBAL_ERROR, payload);
  });

  it('shoul create the login action', () => {
    const payload = 'domain';
    testActionCreator(doLogin, LOGIN, payload);
  });

  it('shoul create the logout action', () => {
    const payload = null;
    testActionCreator(doLogout, LOGOUT, payload);
  });
});
