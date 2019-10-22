import { testActionCreator } from 'test/utils';

import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,

  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,

  LOGIN,
  LOGOUT,

  REQUEST_CATEGORIES,
  REQUEST_CATEGORIES_SUCCESS,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
} from './constants';

import {
  authenticateUser,
  authorizeUser,

  showGlobalError,
  resetGlobalError,

  doLogin,
  doLogout,

  requestCategories,
  requestCategoriesSuccess,

  uploadRequest,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
} from './actions';


describe('App actions', () => {
  it('should dispatch authenticate user action', () => {
    const userName = 'name';
    const userScopes = 'scopes';
    const accessToken = 'token';
    const payload = {
      userName,
      userScopes,
      accessToken,
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
      accessToken,
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

  it('should dispatch REQUEST_CATEGORIES action', () => {
    testActionCreator(requestCategories, REQUEST_CATEGORIES);
    testActionCreator(requestCategoriesSuccess, REQUEST_CATEGORIES_SUCCESS, { results: {} });
  });

  it('should dispatch upload request action', () => {
    const payload = {
      id: 666,
      file: {
        name: 'image.jpg',
      },
    };
    testActionCreator(uploadRequest, UPLOAD_REQUEST, payload);
  });

  it('should dispatch upload progess action', () => {
    const payload = 0.666;
    testActionCreator(uploadProgress, UPLOAD_PROGRESS, payload);
  });

  it('should dispatch upload success action', () => {
    testActionCreator(uploadSuccess, UPLOAD_SUCCESS);
  });

  it('should dispatch upload failure action', () => {
    testActionCreator(uploadFailure, UPLOAD_FAILURE);
  });
});
