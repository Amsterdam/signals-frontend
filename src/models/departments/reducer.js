// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';
import {
  FETCH_DEPARTMENTS_SUCCESS,
  FETCH_DEPARTMENTS,
  FETCH_DEPARTMENTS_ERROR,
} from './constants';

export const initialState = fromJS({
  count: undefined,
  error: false,
  errorMessage: '',
  list: [],
  loading: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DEPARTMENTS:
      return initialState.set('loading', true);

    case FETCH_DEPARTMENTS_SUCCESS:
      return state
        .set('count', action.payload.count)
        .set('error', false)
        .set('errorMessage', '')
        .set('list', fromJS(action.payload.results))
        .set('loading', false);

    case FETCH_DEPARTMENTS_ERROR:
      return state
        .set('error', true)
        .set('errorMessage', action.payload)
        .set('loading', false);

    default:
      return state;
  }
};
