import { fromJS } from 'immutable';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR
} from './constants';


const initialState = fromJS({
  defaultTexts: [],
  loading: false,
  error: false,
  defaultTextsOptionList
});

function defaultTextsAdminReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DEFAULT_TEXTS:
      return state
        .set('loading', true)
        .set('error', false);

    case FETCH_DEFAULT_TEXTS_SUCCESS:
      return state
        .set('defaultTexts', fromJS(action.payload))
        .set('loading', false)
        .set('error', false);

    case FETCH_DEFAULT_TEXTS_ERROR:
      return state
        .set('loading', false)
        .set('error', true);

    default:
      return state;
  }
}

export default defaultTextsAdminReducer;
