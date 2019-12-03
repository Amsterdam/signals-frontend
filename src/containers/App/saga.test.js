import { call, put, take, takeLatest, takeEvery } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { push } from 'connected-react-router/immutable';
import request from 'utils/request';
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { authCall } from 'shared/services/api/api';
import stateTokenGenerator from 'shared/services/auth/services/state-token-generator/state-token-generator';

import { VARIANT_ERROR } from 'containers/Notification/constants';

import watchAppSaga, {
  callLogin,
  callLogout,
  callAuthorize,
  fetchCategories,
  uploadFileWrapper,
  uploadFile,
  baseUrl,
} from './saga';
import {
  LOGIN,
  LOGOUT,
  AUTHENTICATE_USER,
  REQUEST_CATEGORIES,
  UPLOAD_REQUEST,
} from './constants';
import {
  loginFailed,
  logoutFailed,
  authorizeUser,
  showGlobalNotification,
  requestCategoriesSuccess,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
} from './actions';
import { login, logout } from '../../shared/services/auth/auth';
import mapCategories from '../../shared/services/map-categories';
import fileUploadChannel from '../../shared/services/file-upload-channel';

jest.mock(
  'shared/services/auth/services/state-token-generator/state-token-generator'
);
jest.mock('shared/services/api/api');
jest.mock('../../shared/services/map-categories');
jest.mock('../../shared/services/file-upload-channel');

describe('App saga', () => {
  let origSessionStorage;

  beforeEach(() => {
    stateTokenGenerator.mockImplementation(
      () => 'n8vd9fv528934n797cv342bj3h56'
    );
    global.window.open = jest.fn();
    origSessionStorage = global.localStorage;
    global.localStorage = {
      getItem: key => {
        switch (key) {
          case 'accessToken':
            return '42';
          case 'oauthDomain':
            return 'login-domain.it';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    global.localStorage = origSessionStorage;
    jest.resetAllMocks();
  });

  it('should watchAppSaga', () => {
    testSaga(watchAppSaga)
      .next()
      .all([
        takeLatest(LOGIN, callLogin),
        takeLatest(LOGOUT, callLogout),
        takeLatest(AUTHENTICATE_USER, callAuthorize),
        takeLatest(REQUEST_CATEGORIES, fetchCategories),
        takeEvery(UPLOAD_REQUEST, uploadFileWrapper),
      ])
      .next()
      .isDone();
  });

  describe('login', () => {
    const payload = 'datapunt';

    it('should dispatch success', () => {
      const action = { payload };

      testSaga(callLogin, action)
        .next()
        .call(login, payload)
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      stateTokenGenerator.mockImplementationOnce(() => undefined);

      const action = { payload };

      return expectSaga(callLogin, action)
        .call(login, payload)
        .put(
          loginFailed('crypto library is not available on the current browser')
        )
        .put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'LOGIN_FAILED' }))
        .run();
    });
  });

  describe('logout', () => {
    it('should dispatch success', () => {
      testSaga(callLogout)
        .next()
        .call(logout)
        .next()
        .put(push('/'))
        .next()
        .isDone();
    });

    it('should grip success', () => {
      jest.spyOn(global.localStorage, 'getItem').mockImplementationOnce(key => {
        switch (key) {
          case 'oauthDomain':
            return 'grip';
          default:
            return '';
        }
      });

      testSaga(callLogout).next();
      expect(window.open).toHaveBeenCalledWith(
        'https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t',
        '_blank'
      );
    });

    it('should dispatch error', () => {
      const message = 'no remove';
      jest
        .spyOn(global.localStorage, 'removeItem')
        .mockImplementationOnce(() => {
          throw new Error(message);
        });

      return expectSaga(callLogout)
        .call(logout)
        .put(logoutFailed(message))
        .put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'LOGOUT_FAILED' }))
        .run();
    });
  });

  describe('callAuthorize', () => {
    beforeEach(() => {
      // mocking reload function in global location object, since jsdom doesn't support reload and will throw an error
      global.location.reload = jest.fn();
    });

    afterEach(() => {
      global.location.reload.mockRestore();
    });

    const payload = {
      accessToken: 'akjgrff',
      userName: 'foo@bar.com',
      userScopes: ['SIG/ALL'],
    };

    it('should dispatch success', () => {
      const mockResponse = {
        groups: ['SIG/ALL'],
        permissions: ['foo', 'bar'],
      };
      const mockCredentials = {
        ...payload,
        userScopes: mockResponse.groups,
        userPermissions: mockResponse.permissions,
      };
      const action = { payload };

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), mockResponse]])
        .call(authCall, baseUrl, null, payload.accessToken)
        .put(authorizeUser(mockCredentials))
        .run();
    });

    it('should fail without message when accessToken is not available', () => {
      const action = { payload: {} };

      return expectSaga(callAuthorize, action)
        .not.call(authCall)
        .run();
    });

    it('should dispatch error when authorization has failed', async () => {
      const action = { payload };
      const errorObj = new Error('Whoops');
      errorObj.response = {
        status: 403,
      };

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), throwError(errorObj)]])
        .put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'AUTHORIZE_FAILED' }))
        .run();
    });

    it('should dispatch error when session has expired', async () => {
      const action = { payload };
      const errorObj = new Error('Whoops');
      errorObj.response = {
        status: 401,
      };

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), throwError(errorObj)]])
        .call(logout)
        .run();
    });
  });

  describe('fetchCategories', () => {
    const requestURL =
      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/';

    it('should dispatch success', () => {
      const categories = { categories: [1], subcategorie: [2] };

      mapCategories.mockImplementation(() => categories);

      testSaga(fetchCategories)
        .next()
        .call(request, requestURL)
        .next()
        .put(requestCategoriesSuccess(mapCategories(categories)))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('could not fetch');

      return expectSaga(fetchCategories)
        .provide([[matchers.call.fn(request), throwError(error)]])
        .call(request, requestURL)
        .put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'FETCH_CATEGORIES_FAILED' }))
        .run();
    });
  });

  describe('uploadFileWrapper', () => {
    it('should trigger uploadFile', () => {
      const payload = {
        id: 666,
        file: {},
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
        file: { name: 'image.jpg' },
      };
      mockChannel = channel();
      gen = uploadFile({ payload });
    });

    it('should success', () => {
      expect(gen.next().value).toEqual(
        call(
          fileUploadChannel,
          'https://acc.api.data.amsterdam.nl/signals/signal/image/',
          { name: 'image.jpg' },
          666
        )
      ); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects

      expect(
        gen.next({
          progress: 0.23,
          error: false,
          success: false,
        }).value
      ).toEqual(put(uploadProgress(0.23))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects
      expect(
        gen.next({
          progress: 1,
          error: false,
          success: true,
        }).value
      ).toEqual(put(uploadSuccess({ name: 'image.jpg' }))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined();
    });

    it('should fail', () => {
      expect(gen.next().value).toEqual(
        call(
          fileUploadChannel,
          'https://acc.api.data.amsterdam.nl/signals/signal/image/',
          { name: 'image.jpg' },
          666
        )
      ); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects

      expect(
        gen.next({
          error: false,
          success: false,
        }).value
      ).toEqual(put(uploadProgress(0))); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next(mockChannel).value).toEqual(take(mockChannel)); // eslint-disable-line redux-saga/yield-effects
      expect(
        gen.next({
          progress: 1,
          error: true,
          success: false,
        }).value
      ).toEqual(put(uploadFailure())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next().value).toEqual(
        put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'UPLOAD_FAILED' }))
      ); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined();
    });
  });
});
