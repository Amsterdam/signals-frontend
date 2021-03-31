// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { testActionCreator } from 'test/utils';

import {
  FETCH_DEFAULT_TEXTS,
  FETCH_DEFAULT_TEXTS_SUCCESS,
  FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS,
  STORE_DEFAULT_TEXTS_SUCCESS,
  STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS,
} from './constants';

import {
  fetchDefaultTexts,
  fetchDefaultTextsSuccess,
  fetchDefaultTextsError,
  storeDefaultTexts,
  storeDefaultTextsSuccess,
  storeDefaultTextsError,
  orderDefaultTexts,
} from './actions';

describe('DefaultTextsAdmin actions', () => {
  it('should dispatch fetchDefaultTexts action', () => {
    const payload = {};
    testActionCreator(fetchDefaultTexts, FETCH_DEFAULT_TEXTS, payload);
  });

  it('should dispatch fetchDefaultTexts action', () => {
    const payload = {};
    testActionCreator(fetchDefaultTextsSuccess, FETCH_DEFAULT_TEXTS_SUCCESS, payload);
  });

  it('should dispatch fetchDefaultTextsError action', () => {
    testActionCreator(fetchDefaultTextsError, FETCH_DEFAULT_TEXTS_ERROR);
  });

  it('should dispatch storeDefaultTexts action', () => {
    const payload = {};
    testActionCreator(storeDefaultTexts, STORE_DEFAULT_TEXTS, payload);
  });

  it('should dispatch storeDefaultTextsSuccess action', () => {
    const payload = {};
    testActionCreator(storeDefaultTextsSuccess, STORE_DEFAULT_TEXTS_SUCCESS, payload);
  });

  it('should dispatch storeDefaultTextsError action', () => {
    testActionCreator(storeDefaultTextsError, STORE_DEFAULT_TEXTS_ERROR);
  });

  it('should dispatch orderDefaultTexts action', () => {
    const payload = {};
    testActionCreator(orderDefaultTexts, ORDER_DEFAULT_TEXTS, payload);
  });
});
