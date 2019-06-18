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

import {
  AUTHORIZE_USER,
  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,
  REQUEST_CATEGORIES_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
  upload: {},
  categories: {
    main: [],
    sub: []
  }
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZE_USER:
      return state
        .set('userName', action.payload.userName)
        .set('userPermissions', fromJS(action.payload.userPermissions))
        .set('accessToken', action.payload.accessToken);

    case SHOW_GLOBAL_ERROR:
      return state
        .set('error', !!(action.payload))
        .set('errorMessage', action.payload)
        .set('loading', false);

    case RESET_GLOBAL_ERROR:
      return state
        .set('error', false)
        .set('errorMessage', '')
        .set('loading', false);

    case REQUEST_CATEGORIES_SUCCESS:
      return state
        .set('categories', fromJS(action.payload));

    case UPLOAD_REQUEST:
      return state
        .set('upload', fromJS({
          id: action.payload.id,
          file: action.payload.file.name
        }));

    case UPLOAD_PROGRESS:
      return state
        .set('upload', fromJS({
          ...state.get('upload').toJS(),
          progress: action.payload
        }));

    case UPLOAD_SUCCESS:
    case UPLOAD_FAILURE:
      return state
        .set('upload', fromJS({}));

    default:
      return state;
  }
}

export default appReducer;
