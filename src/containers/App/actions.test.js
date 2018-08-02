import { testActionCreator } from '../../../internals/testing/test-utils';

import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,

  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,

  LOGIN,
  LOGOUT

  // UPLOAD_REQUEST,
  // UPLOAD_PROGRESS,
  // UPLOAD_SUCCESS,
  // UPLOAD_FAILURE
} from './constants';

import {
  authenticateUser,
  authorizeUser,

  showGlobalError,
  resetGlobalError,

  doLogin,
  doLogout

  // uploadRequest,
  // uploadProgress,
  // uploadSuccess,
  // uploadFailure
} from './actions';


describe('App actions', () => {
  it('should dispatch authenticate user action', () => {
    const userName = 'name';
    const userScopes = 'scopes';
    const accessToken = 'token';
    const payload = {
      userName,
      userScopes,
      accessToken
    };
    testActionCreator(authenticateUser, AUTHENTICATE_USER, payload);
  });

  it('should dispatch authorize user, action', () => {
    const userName = 'name';
    const userScopes = 'scopes';
    const accessToken = 'token';
    const payload = {
      userName,
      userScopes,
      accessToken
    };
    testActionCreator(authorizeUser, AUTHORIZE_USER, payload);
  });

  it('should dispatch show global error action', () => {
    const payload = 'global error';
    testActionCreator(showGlobalError, SHOW_GLOBAL_ERROR, payload);
  });

  it('should dispatch reset global error action', () => {
    testActionCreator(resetGlobalError, RESET_GLOBAL_ERROR);
  });

  it('should dispatch login action', () => {
    const payload = 'domain';
    testActionCreator(doLogin, LOGIN, payload);
  });

  it('should dispatch logout action', () => {
    const payload = null;
    testActionCreator(doLogout, LOGOUT, payload);
  });
});
