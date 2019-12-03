import { fromJS } from 'immutable';

import { ACCESS_TOKEN } from 'shared/services/auth/auth';
import appReducer, { initialState } from './reducer';

import {
  AUTHORIZE_USER,
  LOGIN_FAILED,
  LOGOUT_FAILED,
  LOGOUT,
  REQUEST_CATEGORIES_SUCCESS,
  RESET_GLOBAL_NOTIFICATION,
  SHOW_GLOBAL_NOTIFICATION,
  UPLOAD_FAILURE,
  UPLOAD_PROGRESS,
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
} from './constants';

describe('appReducer', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('AUTHORIZE_USER', () => {
    it('sets user name, scopes and access token', () => {
      expect(
        appReducer(fromJS({}), {
          type: AUTHORIZE_USER,
          payload: {
            userName: 'Diabolo',
            userScopes: ['SCOPE'],
            accessToken: 'DFGHJGFDSDFGHJKJH',
          },
        }).toJS(),
      ).toEqual({
        userName: 'Diabolo',
        userScopes: ['SCOPE'],
        accessToken: 'DFGHJGFDSDFGHJKJH',
      });
    });

    it('should set the access token in session storage', () => {
      const accessToken = 'DFGHJGFDSDFGHJKJH';
      const action = {
        type: AUTHORIZE_USER,
        payload: {
          userName: 'Diabolo',
          userScopes: ['SCOPE'],
          accessToken,
        },
      };

      appReducer(fromJS({}), action);

      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        accessToken,
      );
    });
  });

  describe('SHOW_GLOBAL_NOTIFICATION', () => {
    it('sets global error message', () => {
      expect(
        appReducer(fromJS({}), {
          type: SHOW_GLOBAL_NOTIFICATION,
          payload: 'ERROR_MESSAGE',
        }).toJS(),
      ).toEqual({
        error: true,
        errorMessage: 'ERROR_MESSAGE',
        loading: false,
      });
    });
  });

  describe('RESET_GLOBAL_NOTIFICATION', () => {
    it('resets global error message', () => {
      expect(
        appReducer(fromJS({}), {
          type: RESET_GLOBAL_NOTIFICATION,
        }).toJS(),
      ).toEqual({
        error: false,
        errorMessage: '',
        loading: false,
      });
    });
  });

  describe('REQUEST_CATEGORIES_SUCCESS', () => {
    it('should', () => {
      expect(
        appReducer(fromJS({}), {
          type: REQUEST_CATEGORIES_SUCCESS,
          payload: {
            results: [1, 2],
          },
        }).toJS(),
      ).toEqual({
        categories: {
          results: [1, 2],
        },
      });
    });
  });

  describe('UPLOAD_REQUEST', () => {
    it('starts file upload', () => {
      expect(
        appReducer(fromJS({}), {
          type: UPLOAD_REQUEST,
          payload: {
            id: 666,
            file: {
              name: 'image.jpg',
            },
          },
        }).toJS(),
      ).toEqual({
        upload: {
          id: 666,
          file: 'image.jpg',
        },
      });
    });
  });

  describe('UPLOAD_PROGRESS', () => {
    it('file upload progress', () => {
      expect(
        appReducer(
          fromJS({
            upload: {
              id: 666,
              file: 'image.jpg',
            },
          }),
          {
            type: UPLOAD_PROGRESS,
            payload: 0.345,
          },
        ).toJS(),
      ).toEqual({
        upload: {
          id: 666,
          file: 'image.jpg',
          progress: 0.345,
        },
      });
    });
  });

  describe('UPLOAD_SUCCESS', () => {
    it('file upload success', () => {
      expect(
        appReducer(
          fromJS({
            upload: {
              id: 666,
              file: 'image.jpg',
              progress: 0.678,
            },
          }),
          {
            type: UPLOAD_SUCCESS,
          },
        ).toJS(),
      ).toEqual({
        upload: {},
      });
    });
  });

  describe('UPLOAD_FAILURE', () => {
    it('file upload success', () => {
      expect(
        appReducer(
          fromJS({
            upload: {
              id: 666,
              file: 'image.jpg',
              progress: 0.678,
            },
          }),
          {
            type: UPLOAD_FAILURE,
          },
        ).toJS(),
      ).toEqual({
        upload: {},
      });
    });
  });

  describe('LOGIN_FAILED', () => {
    it('should handle failed login', () => {
      expect(
        appReducer(fromJS({}), {
          type: LOGIN_FAILED,
          payload: 'ERROR_MESSAGE',
        }).toJS(),
      ).toEqual({
        error: true,
        errorMessage: 'ERROR_MESSAGE',
        loading: false,
      });
    });
  });

  describe('LOGOUT_FAILED', () => {
    it('should handle failed logout', () => {
      expect(
        appReducer(fromJS({}), {
          type: LOGOUT_FAILED,
          payload: 'ERROR_MESSAGE',
        }).toJS(),
      ).toEqual({
        error: true,
        errorMessage: 'ERROR_MESSAGE',
        loading: false,
      });
    });
  });


  describe('LOGOUT', () => {
    it('should handle logout', () => {
      expect(
        appReducer(fromJS({}), {
          type: LOGOUT,
        }).toJS(),
      ).toEqual({
        upload: {},
        userName: undefined,
        userScopes: undefined,
        userPermissions: [],
        accessToken: undefined,
      });
    });
  });
});
