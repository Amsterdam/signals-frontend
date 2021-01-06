import { VARIANT_NOTICE, TYPE_LOCAL } from 'containers/Notification/constants';

import { APPLY_FILTER } from 'signals/incident-management/constants';
import {
  LOGIN_FAILED,
  LOGOUT_FAILED,
  LOGOUT,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  SET_SEARCH_QUERY,
  RESET_SEARCH_QUERY,
  GET_SOURCES,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
} from './constants';
import type { Action, AppState } from './types';

// The initial state of the App
export const initialState: AppState = {
  loading: false,
  error: false,
  upload: {},
  user: {
    permissions: [],
    roles: [],
  },
  notification: {
    message: '',
    title: '',
    variant: VARIANT_NOTICE,
    type: TYPE_LOCAL,
  },
  searchQuery: '',
  sources: [],
};

// eslint-disable-next-line @typescript-eslint/default-param-last
function appReducer(state: AppState = initialState, action: Action<unknown>) {
  switch (action.type) {
    case AUTHORIZE_USER:
      return {
        ...state,
        user: action.payload,
      };

    case LOGIN_FAILED:
    case LOGOUT_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case SHOW_GLOBAL_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    case RESET_GLOBAL_NOTIFICATION:
      return {
        ...state,
        notification: { ...initialState.notification },
      };

    case UPLOAD_PROGRESS:
      return {
        ...state,
        upload: { progress: action.payload },
      };

    case UPLOAD_SUCCESS:
    case UPLOAD_FAILURE:
      return {
        ...state,
        upload: { },
      };

    case LOGOUT:
      return {
        ...state,
        user: { ...initialState.user },
      };

    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case RESET_SEARCH_QUERY:
    case APPLY_FILTER:
      return {
        ...state,
        searchQuery: initialState.searchQuery,
      };

    case GET_SOURCES:
      return {
        ...state,
        loading: true,
      };

    case GET_SOURCES_SUCCESS:
      return {
        ...state,
        sources: action.payload,
        loading: false,
      };

    case GET_SOURCES_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        notification: {
          ...state.notification,
          message: action.payload,
        },
      };

    default:
      return state;
  }
}

export default appReducer;
