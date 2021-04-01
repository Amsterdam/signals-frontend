// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS_SUCCESS, STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS,
} from './constants';

export const initialState = fromJS({
  defaultTexts: [],
  loading: false,
  error: false,
  storing: false,
  defaultTextsOptionList,
});

function defaultTextsAdminReducer(state = initialState, action) {
  let defaultTexts;
  let delta;

  switch (action.type) {
    case FETCH_DEFAULT_TEXTS:
      return state
        .set('categoryUrl', fromJS(action.payload.category_url))
        .set('state', fromJS(action.payload.state))
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

    case STORE_DEFAULT_TEXTS:
      return state
        .set('storing', true)
        .set('error', false);

    case STORE_DEFAULT_TEXTS_SUCCESS:
      return state
        .set('defaultTexts', fromJS(action.payload))
        .set('storing', false)
        .set('error', false);

    case STORE_DEFAULT_TEXTS_ERROR:
      return state
        .set('storing', false)
        .set('error', true);

    case ORDER_DEFAULT_TEXTS:
      defaultTexts = state.get('defaultTexts').toJS();
      delta = action.payload.type === 'up' ? -1 : 1;
      defaultTexts.splice(action.payload.index + delta, 0, defaultTexts.splice(action.payload.index, 1)[0]);
      return state
        .set('defaultTexts', fromJS([...defaultTexts]));

    default:
      return state;
  }
}

export default defaultTextsAdminReducer;
