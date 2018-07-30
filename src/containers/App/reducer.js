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
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZE_USER:
      return state
        .set('userName', action.payload.userName)
        .set('userScopes', fromJS(action.payload.userScopes))
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

    case UPLOAD_REQUEST:
      return state;

    case UPLOAD_PROGRESS:
      return state;

    case UPLOAD_SUCCESS:
      return state;

    case UPLOAD_FAILURE:
      return state;

    default:
      return state;
  }
}

export default appReducer;
