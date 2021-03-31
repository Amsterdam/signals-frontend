// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';

import {
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES,
} from './constants';

export const initialState = fromJS({
  loading: false,
  error: null,
  categories: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return state.set('loading', true);

    case FETCH_CATEGORIES_FAILED:
      return state.set('loading', false).set('error', fromJS(action.payload));

    case FETCH_CATEGORIES_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('categories', fromJS(action.payload));

    default:
      return state;
  }
};
