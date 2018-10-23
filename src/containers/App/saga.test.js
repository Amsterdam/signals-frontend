import { all, call, put, take, takeLatest, takeEvery } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { push } from 'react-router-redux';
import request from 'utils/request';

import { authCall } from 'shared/services/api/api';
import watchAppSaga, { callLogin, callLogout, callAuthorize, fetchCategories, uploadFileWrapper, uploadFile } from './saga';
import { LOGIN, LOGOUT, AUTHENTICATE_USER, REQUEST_CATEGORIES, UPLOAD_REQUEST } from './constants';
import { authorizeUser, showGlobalError, requestCategoriesSuccess, uploadProgress, uploadSuccess, uploadFailure } from './actions';
import { login, logout, getOauthDomain } from '../../shared/services/auth/auth';
import mapCategories from '../../shared/services/map-categories';
import fileUploadChannel from '../../shared/services/file-upload-channel';

jest.mock('../../shared/services/auth/auth');
jest.mock('shared/services/api/api');
jest.mock('../../shared/services/map-categories');
jest.mock('../../shared/services/file-upload-channel');

describe('App saga', () => {
  beforeEach(() => {
    global.window.open = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchAppSaga', () => {
    const gen = watchAppSaga();
    expect(gen.next().value).toEqual(all([ // eslint-disable-line redux-saga/yield-effects
      takeLatest(LOGIN, callLogin), // eslint-disable-line redux-saga/yield-effects
      takeLatest(LOGOUT, callLogout), // eslint-disable-line redux-saga/yield-effects
      takeLatest(AUTHENTICATE_USER, callAuthorize), // eslint-disable-line redux-saga/yield-effects
      takeLatest(REQUEST_CATEGORIES, fetchCategories),
      takeEvery(UPLOAD_REQUEST, uploadFileWrapper) // eslint-disable-line redux-saga/yield-effects
    ])
    );
  });

  describe('login', () => {
    const payload = 'datapunt';

    it('should success', () => {
      const gen = callLogin({ payload });
      gen.next();
      expect(login).toHaveBeenCalledWith(payload);
    });

    // @TODO fix this test
    // it.only('should error', () => {
      // const gen = callLogin({ payload });
      // gen.next();
      // expect(gen.throw().value).toEqual(put(showGlobalError('LOGIN_FAILED'))); // eslint-disable-line redux-saga/yield-effects
      // expect(1).toBe(1);
    // });
  });

  describe('logout', () => {
    it('should success', () => {
      getOauthDomain.mockImplementation(() => '');
      const gen = callLogout();
      const value = gen.next().value;
      expect(value).toEqual(put(push('/'))); // eslint-disable-line redux-saga/yield-effects
      expect(logout).toHaveBeenCalledWith();
    });

    it('should grip success', () => {
      getOauthDomain.mockImplementation(() => 'grip');
      const gen = callLogout();
      gen.next();
      expect(window.open).toHaveBeenCalledWith('https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t', '_blank');
    });

    it('should error', () => {
      // const error = new Error();
      const gen = callLogout();
      gen.next();
      expect(gen.throw().value).toEqual(put(showGlobalError('LOGOUT_FAILED'))); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('callAuthorize', () => {
    const payload = {
      accessToken: 'akjgrff',
      userName: 'foo@bar.com',
      userScopes: [
        'SIG/ALL'
      ]
    };

    it('should success', () => {
      const mockCredentials = {
        accessToken: 'akjgrff',
        userName: 'foo@bar.com',
        userScopes: ['SIG/ALL']
      };
      const gen = callAuthorize({ payload });
      expect(gen.next().value).toEqual(authCall('https://acc.api.data.amsterdam.nl/signals/user/auth/me', null, 'akjgrff')); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next({
        groups: ['SIG/ALL']
      }).value).toEqual(put(authorizeUser(mockCredentials))); // eslint-disable-line redux-saga/yield-effects
    });

    it('should success', () => {
      const mockCredentials = {
        accessToken: 'akjgrff',
        userName: 'foo@bar.com',
        userScopes: ['SIG/ALL']
      };
      const gen = callAuthorize({ payload });
      expect(gen.next().value).toEqual(authCall('https://acc.api.data.amsterdam.nl/signals/user/auth/me', null, 'akjgrff')); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next({
        groups: ['SIG/ALL']
      }).value).toEqual(put(authorizeUser(mockCredentials))); // eslint-disable-line redux-saga/yield-effects
    });

    it('should fail without message when accessToken is not available', () => {
      const gen = callAuthorize({ payload: null });
      expect(gen.next().value).toBeUndefined();
    });

    it('should error', () => {
      const gen = callAuthorize({ payload });
      gen.next();
      expect(gen.throw().value).toEqual(put(showGlobalError('AUTHORIZE_FAILED'))); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('fetchCategories', () => {
    it('should success', () => {
      const categories = { categories: [1], subcategorie: [2] };

      mapCategories.mockImplementation(() => categories);
      const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories';

      const gen = fetchCategories();
      expect(gen.next().value).toEqual(call(request, requestURL)); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(categories).value).toEqual(put(requestCategoriesSuccess(categories))); // eslint-disable-line redux-saga/yield-effects
    });

    it('should error', () => {
      const gen = fetchCategories();
      gen.next();
      expect(gen.throw().value).toEqual(put(showGlobalError('FETCH_CATEGORIES_FAILED'))); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('uploadFileWrapper', () => {
    it('should trigger uploadFile', () => {
      const payload = {
        id: 666,
        file: {}
      };
      const gen = uploadFileWrapper({ payload });
      expect(gen.next().value).toEqual(call(uploadFile, { payload })); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('uploadFile', () => {
    let payload;
    let mockChannel;
    let gen;

    beforeEach(() => {
      payload = {
        id: 666,
        file: { name: 'image.jpg' }
      };
      mockChannel = channel();
      gen = uploadFile({ payload });
    });

    it('should success', () => {
      expect(gen.next().value).toEqual(call(fileUploadChannel, 'https://acc.api.data.amsterdam.nl/signals/signal/image/', { name: 'image.jpg' }, 666)); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next({
        progress: 0.23,
        error: false,
        success: false
      }).value).toEqual(put(uploadProgress(0.23))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next({
        progress: 1,
        error: false,
        success: true
      }).value).toEqual(put(uploadSuccess({ name: 'image.jpg' }))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined();
    });

    it('should fail', () => {
      expect(gen.next().value).toEqual(call(fileUploadChannel, 'https://acc.api.data.amsterdam.nl/signals/signal/image/', { name: 'image.jpg' }, 666)); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next({
        error: false,
        success: false
      }).value).toEqual(put(uploadProgress(0))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next({
        progress: 1,
        error: true,
        success: false
      }).value).toEqual(put(uploadFailure())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next().value).toEqual(put(showGlobalError('UPLOAD_FAILED'))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined();
    });
  });
});
