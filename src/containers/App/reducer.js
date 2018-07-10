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

import { AUTHENTICATE_USER, SHOW_GLOBAL_ERROR } from './constants';

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_USER:
      return state
        .set('userName', action.payload.userName)
        .set('userScopes', fromJS(action.payload.userScopes))
        .set('accessToken', action.payload.accessToken);
    case SHOW_GLOBAL_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
