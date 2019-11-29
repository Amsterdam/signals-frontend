/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import { ACCESS_TOKEN } from 'shared/services/auth/auth';
import { TYPE_DEFAULT } from 'components/Notification';

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

// The initial state of the App
export const initialState = fromJS({
  accessToken: undefined,
  categories: {
    main: [],
    sub: [],
    mainToSub: {},
  },
  error: false,
  loading: false,
  notification: {
    message: '',
    title: '',
    type: TYPE_DEFAULT,
  },
  upload: {},
  userName: undefined,
  userPermissions: [],
  userScopes: undefined,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZE_USER:
      global.localStorage.setItem(ACCESS_TOKEN, action.payload.accessToken);

      return state
        .set('userName', action.payload.userName)
        .set('userScopes', fromJS(action.payload.userScopes))
        .set('userPermissions', fromJS(action.payload.userPermissions))
        .set('accessToken', action.payload.accessToken);

    case LOGIN_FAILED:
    case LOGOUT_FAILED:
      return state
        .set('error', Boolean(action.payload))
        .set('loading', false);

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
        .set('upload', fromJS({}))
        .set('userName', undefined)
        .set('userScopes', undefined)
        .set('userPermissions', [])
        .set('accessToken', undefined);

    default:
      return state;
  }
}

export default appReducer;
