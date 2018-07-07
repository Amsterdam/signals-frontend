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

import { AUTHENTICATE_USER } from './constants';

// The initial state of the App
const initialState = fromJS({
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
    default:
      return state;
  }
}

export default appReducer;
