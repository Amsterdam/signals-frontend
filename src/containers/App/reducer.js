import produce from 'immer';

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

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  upload: {},
  userPermissions: [],
  categories: {
    main: [],
    sub: [],
  },
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AUTHORIZE_USER:
        draft.userName = action.payload.userName;
        draft.userScopes = action.payload.userScopes;
        draft.userPermissions = action.payload.userPermissions;
        draft.accessToken = action.payload.accessToken;
        break;

      case SHOW_GLOBAL_ERROR:
        draft.error = !!action.payload;
        draft.errorMessage = action.payload;
        draft.loading = false;
        break;

      case RESET_GLOBAL_ERROR:
        draft.error = false;
        draft.errorMessage = '';
        draft.loading = false;
        break;

      case REQUEST_CATEGORIES_SUCCESS:
        draft.categories = action.payload;
        break;

      case UPLOAD_REQUEST:
        draft.upload = {
          id: action.payload.id,
          file: action.payload.file.name,
        };
        break;

      case UPLOAD_PROGRESS:
        draft.upload = {
          ...state.upload,
          progress: action.payload,
        };
        break;

      case UPLOAD_SUCCESS:
      case UPLOAD_FAILURE:
        draft.upload = {};
        break;
    }
  });
