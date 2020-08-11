import { fromJS } from 'immutable';

import { VARIANT_DEFAULT, TYPE_DEFAULT } from 'containers/Notification/constants';

import { APPLY_FILTER } from 'signals/incident-management/constants';
import {
  LOGIN_FAILED,
  LOGOUT_FAILED,
  LOGOUT,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  SET_SEARCH_QUERY,
  RESET_SEARCH_QUERY,
  GET_SOURCES,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
  upload: {},
  user: {
    permissions: [],
    roles: [],
    profile: null,
  },
  notification: {
    message: '',
    title: '',
    variant: VARIANT_DEFAULT,
    type: TYPE_DEFAULT,
  },
  searchQuery: '',
  sources: [],
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZE_USER:
      return state.set('user', fromJS(action.payload));

    case LOGIN_FAILED:
    case LOGOUT_FAILED:
      return state.set('error', Boolean(action.payload)).set('loading', false);

    case SHOW_GLOBAL_NOTIFICATION:
      return state.set('notification', fromJS({ ...action.payload }));

    case RESET_GLOBAL_NOTIFICATION:
      return state.set('notification', initialState.get('notification'));

    case UPLOAD_REQUEST:
      return state.set(
        'upload',
        fromJS({
          id: action.payload.id,
          file: action.payload.file.name,
        })
      );

    case UPLOAD_PROGRESS:
      return state.set(
        'upload',
        fromJS({
          ...state.get('upload').toJS(),
          progress: action.payload,
        })
      );

    case UPLOAD_SUCCESS:
    case UPLOAD_FAILURE:
      return state.set('upload', fromJS({}));

    case LOGOUT:
      return state.set('user', initialState.get('user')).set('upload', initialState.get('upload'));

    case SET_SEARCH_QUERY:
      return state.set('searchQuery', action.payload);

    case RESET_SEARCH_QUERY:
    case APPLY_FILTER:
      return state.set('searchQuery', initialState.get('searchQuery'));

    case GET_SOURCES:
      return state.set('loading', true);

    case GET_SOURCES_SUCCESS:
      return state.set('sources', fromJS(action.payload)).set('loading', false);

    case GET_SOURCES_FAILED:
      return state.set('loading', false).set('error', true).set('errorMessage', action.payload);

    default:
      return state;
  }
}

export default appReducer;
