import { testActionCreator } from '../../../internals/testing/test-utils';

import {
  AUTHENTICATE_USER, SHOW_GLOBAL_ERROR
} from './constants';

import {
  authenticateUser,
  showGlobalError
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
  });

  it('should create show global error action', () => {
    const error = 'global error';
    const payload = error;
    testActionCreator(showGlobalError, SHOW_GLOBAL_ERROR, payload);
  });
});
