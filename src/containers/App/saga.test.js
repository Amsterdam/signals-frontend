import { call, put, take, takeLatest, takeEvery } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { push } from 'connected-react-router/immutable';
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall } from 'shared/services/api/api';
import { login, logout } from 'shared/services/auth/auth';
import fileUploadChannel from 'shared/services/file-upload-channel';
import stateTokenGenerator from 'shared/services/auth/services/state-token-generator/state-token-generator';
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants';
import userJson from 'utils/__tests__/fixtures/user.json';

import watchAppSaga, {
  callLogin,
  callLogout,
  callAuthorize,
  uploadFileWrapper,
  uploadFile,
  callSearchIncidents,
} from './saga';
import {
  LOGIN,
  LOGOUT,
  AUTHENTICATE_USER,
  UPLOAD_REQUEST,
  SET_SEARCH_QUERY,
} from './constants';
import {
  loginFailed,
  logoutFailed,
  authorizeUser,
  showGlobalNotification,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
} from './actions';

jest.mock(
  'shared/services/auth/services/state-token-generator/state-token-generator'
);
jest.mock('shared/services/api/api');
jest.mock('shared/services/map-categories');
jest.mock('shared/services/file-upload-channel');

describe('containers/App/saga', () => {
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
        takeEvery(UPLOAD_REQUEST, uploadFileWrapper),
        takeLatest(SET_SEARCH_QUERY, callSearchIncidents),
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
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Inloggen is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
        .run();
    });
  });

  describe('logout', () => {
    it('should dispatch success', () => {
      testSaga(callLogout)
        .next()
        .call(logout)
        .next()
        .put(push('/login'))
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
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Uitloggen is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
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
    };

    it('should dispatch success', () => {
      const action = { payload };

      return expectSaga(callAuthorize, action)
        .provide([[matchers.call.fn(authCall), userJson]])
        .call(
          authCall,
          CONFIGURATION.AUTH_ME_ENDPOINT,
          null,
          payload.accessToken
        )
        .put(authorizeUser(userJson))
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
        .put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Authenticeren is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
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
          CONFIGURATION.IMAGE_ENDPOINT,
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
          CONFIGURATION.IMAGE_ENDPOINT,
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
        put(
          showGlobalNotification({
            variant: VARIANT_ERROR,
            title: 'Het uploaden van de foto is niet gelukt',
            type: TYPE_GLOBAL,
          })
        )
      ); // eslint-disable-line redux-saga/yield-effects

      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('callSelectIncidents', () => {
    it('should navigate to the manage/incidents', () => {
      const gen = callSearchIncidents();
      expect(gen.next().value).toEqual(put(push('/manage/incidents'))); // eslint-disable-line redux-saga/yield-effects
    });
  });
});
