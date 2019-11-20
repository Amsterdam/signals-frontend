import { fromJS } from 'immutable';

import {
  FETCH_ROLES,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  SAVE_ROLE,
  SAVE_ROLE_SUCCESS,
  SAVE_ROLE_ERROR,
  PATCH_ROLE,
  PATCH_ROLE_SUCCESS,
  PATCH_ROLE_ERROR,
}
  from './constants';

export const initialState = fromJS({
  list: [],
  loading: false,
  saving: false,
  patching: false,
  error: false,
});

function rolesReducer(state = initialState, action) {
  let roles = [];
  let index = null;
  switch (action.type) {
    case FETCH_ROLES:
      return state
        .set('list', fromJS([]))
        .set('loading', true)
        .set('error', false);

    case FETCH_ROLES_SUCCESS:
      return state
        .set('list', fromJS(action.payload))
        .set('loading', false)
        .set('error', false);

    case FETCH_ROLES_ERROR:
      return state
        .set('error', true)
        .set('loading', false);

    case SAVE_ROLE:
      return state
        .set('saving', true)
        .set('error', false);

    case SAVE_ROLE_SUCCESS:
      roles = state.get('list').toJS();
      return state
        .set('list', fromJS([...roles, action.payload]))
        .set('error', false)
        .set('saving', false);

    case SAVE_ROLE_ERROR:
      return state
        .set('error', true)
        .set('saving', false);

    case PATCH_ROLE:
      return state
        .set('patching', true)
        .set('error', false);

    case PATCH_ROLE_SUCCESS:
      roles = state.get('list').toJS();
      index = roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        roles[index] = { ...action.payload };
      }
      return state
        .set('list', fromJS(roles))
        .set('error', false)
        .set('patching', false);

    case PATCH_ROLE_ERROR:
      return state
        .set('error', true)
        .set('patching', false);

    default:
      return state;
  }
}

export default rolesReducer;
