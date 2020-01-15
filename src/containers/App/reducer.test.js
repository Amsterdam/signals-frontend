import { fromJS } from 'immutable';

import userJson from 'utils/__tests__/fixtures/user.json';
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

describe('containers/App/reducer', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('AUTHORIZE_USER', () => {
    it('sets user name, scopes and access token', () => {
      expect(
        appReducer(fromJS({}), {
          type: AUTHORIZE_USER,
          payload: userJson,
        }).toJS()
      ).toEqual({ user: userJson });
    });
  });

  describe('SHOW_GLOBAL_NOTIFICATION', () => {
    it('sets global notification', () => {
      expect(
        appReducer(fromJS({}), {
          type: SHOW_GLOBAL_NOTIFICATION,
          payload: {
            title: 'title',
            message: 'message',
            variant: 'error',
            type: 'global',
          },
        }).toJS()
      ).toEqual({
        notification: {
          title: 'title',
          message: 'message',
          variant: 'error',
          type: 'global',
        },
      });
    });
  });

  describe('RESET_GLOBAL_NOTIFICATION', () => {
    it('resets global notification', () => {
      expect(
        appReducer(fromJS({}), {
          type: RESET_GLOBAL_NOTIFICATION,
        }).toJS()
      ).toEqual({
        notification: initialState.get('notification').toJS(),
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
        }).toJS()
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
        }).toJS()
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
          }
        ).toJS()
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
          }
        ).toJS()
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
          }
        ).toJS()
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
        }).toJS()
      ).toEqual({
        error: true,
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
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
      });
    });
  });

  describe('LOGOUT', () => {
    it('should handle logout', () => {
      const state = fromJS({
        user: {
          permissions: ['a', 'b', 'c'],
          roles: ['c', 'd', 'e'],
        },
        notification: {
          message: 'This is a notifictation',
        },
      });

      const action = {
        type: LOGOUT,
      };

      expect(appReducer(state, action)).toEqual(
        state.set('user', initialState.get('user'))
      );
    });
  });
});
