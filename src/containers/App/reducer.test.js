import { fromJS } from 'immutable';

import { ACCESS_TOKEN } from 'shared/services/auth/auth';
import appReducer, { initialState } from './reducer';

import {
  AUTHORIZE_USER,
  AUTHENTICATE_USER,
  LOGOUT,
  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,
  REQUEST_CATEGORIES_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
} from './constants';

describe('appReducer', () => {
  let origSessionStorage;

  beforeEach(() => {
    origSessionStorage = global.sessionStorage;
    global.sessionStorage = {
      getItem: (key) => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    global.sessionStorage = origSessionStorage;
  });

  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('AUTHENTICATE_USER', () => {
    it('should set the access token in session storage', () => {
      const accessToken =
        'eyJhbGciOiJFUzI1NiIsImtpZCI6ImU1MDJjOGYzLTNkOGEtNDBiMy1hYjZjLTEyOTQ4MzMyYWU5YyJ9';
      const action = {
        type: AUTHENTICATE_USER,
        payload: {
          userName: 'Diabolo',
          userScopes: ['SCOPE'],
          accessToken,
        },
      };

      appReducer(fromJS({}), action);

      expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        accessToken,
      );
    });
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

      expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        accessToken,
      );
    });
  });

  describe('SHOW_GLOBAL_ERROR', () => {
    it('sets global error message', () => {
      expect(
        appReducer(fromJS({}), {
          type: SHOW_GLOBAL_ERROR,
          payload: 'ERROR_MESSAGE',
        }).toJS(),
      ).toEqual({
        error: true,
        errorMessage: 'ERROR_MESSAGE',
        loading: false,
      });
    });
  });

  describe('RESET_GLOBAL_ERROR', () => {
    it('resets global error message', () => {
      expect(
        appReducer(fromJS({}), {
          type: RESET_GLOBAL_ERROR,
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

  describe('LOGOUT', () => {
    it('should remove the access token from session storage', () => {
      const accessToken =
        'eyJhbGciOiJFUzI1NiIsImtpZCI6ImU1MDJjOGYzLTNkOGEtNDBiMy1hYjZjLTEyOTQ4MzMyYWU5YyJ9';
      const action = {
        type: LOGOUT,
      };

      const newState = appReducer(
        fromJS({
          userName: 'Diabolo',
          userScopes: ['SCOPE'],
          accessToken,
        }),
        action,
      ).toJS();

      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith(
        ACCESS_TOKEN,
      );

      expect(newState.userName).toBeUndefined();
      expect(newState.userScopes).toBeUndefined();
      expect(newState.accessToken).toBeUndefined();
    });
  });
});
