import appReducer, { initialState } from './reducer';

import {
  AUTHORIZE_USER,
  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,
  REQUEST_CATEGORIES_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
} from './constants';

describe('appReducer', () => {
  beforeEach(() => {});

  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(initialState);
  });

  describe('AUTHORIZE_USER', () => {
    it('sets user name, scopes and access token', () => {
      expect(
        appReducer(
          {},
          {
            type: AUTHORIZE_USER,
            payload: {
              userName: 'Diabolo',
              userScopes: ['SCOPE'],
              accessToken: 'DFGHJGFDSDFGHJKJH',
            },
          },
        ),
      ).toEqual({
        userName: 'Diabolo',
        userScopes: ['SCOPE'],
        accessToken: 'DFGHJGFDSDFGHJKJH',
      });
    });
  });

  describe('SHOW_GLOBAL_ERROR', () => {
    it('sets global error message', () => {
      expect(
        appReducer(
          {},
          {
            type: SHOW_GLOBAL_ERROR,
            payload: 'ERROR_MESSAGE',
          },
        ),
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
        appReducer(
          {},
          {
            type: RESET_GLOBAL_ERROR,
          },
        ),
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
        appReducer(
          {},
          {
            type: REQUEST_CATEGORIES_SUCCESS,
            payload: {
              results: [1, 2],
            },
          },
        ),
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
        appReducer(
          {},
          {
            type: UPLOAD_REQUEST,
            payload: {
              id: 666,
              file: {
                name: 'image.jpg',
              },
            },
          },
        ),
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
          {
            upload: {
              id: 666,
              file: 'image.jpg',
            },
          },
          {
            type: UPLOAD_PROGRESS,
            payload: 0.345,
          },
        ),
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
          {
            upload: {
              id: 666,
              file: 'image.jpg',
              progress: 0.678,
            },
          },
          {
            type: UPLOAD_SUCCESS,
          },
        ),
      ).toEqual({
        upload: {},
      });
    });
  });

  describe('UPLOAD_FAILURE', () => {
    it('file upload success', () => {
      expect(
        appReducer(
          {
            upload: {
              id: 666,
              file: 'image.jpg',
              progress: 0.678,
            },
          },
          {
            type: UPLOAD_FAILURE,
          },
        ),
      ).toEqual({
        upload: {},
      });
    });
  });
});
