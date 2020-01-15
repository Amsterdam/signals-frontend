import { fromJS } from 'immutable';

import {
  VARIANT_DEFAULT,
  TYPE_DEFAULT,
} from 'containers/Notification/constants';

import {
  LOGIN_FAILED,
  LOGOUT_FAILED,
  LOGOUT,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  REQUEST_CATEGORIES_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
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
  categories: {
    main: [],
    sub: [],
    mainToSub: {},
  },
  notification: {
    message: '',
    title: '',
    variant: VARIANT_DEFAULT,
    type: TYPE_DEFAULT,
  },
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

    case REQUEST_CATEGORIES_SUCCESS:
      return state.set('categories', fromJS(action.payload));

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
      return state
        .set('user', initialState.get('user'));

    default:
      return state;
  }
}

export default appReducer;
