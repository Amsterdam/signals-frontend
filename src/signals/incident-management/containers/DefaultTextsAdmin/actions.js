// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS_SUCCESS, STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS,
} from './constants';

export function fetchDefaultTexts(payload) {
  return {
    type: FETCH_DEFAULT_TEXTS,
    payload,
  };
}

export function fetchDefaultTextsSuccess(payload) {
  return {
    type: FETCH_DEFAULT_TEXTS_SUCCESS,
    payload,
  };
}

export function fetchDefaultTextsError() {
  return {
    type: FETCH_DEFAULT_TEXTS_ERROR,
  };
}

export function storeDefaultTexts(payload) {
  return {
    type: STORE_DEFAULT_TEXTS,
    payload,
  };
}

export function storeDefaultTextsSuccess(payload) {
  return {
    type: STORE_DEFAULT_TEXTS_SUCCESS,
    payload,
  };
}

export function storeDefaultTextsError() {
  return {
    type: STORE_DEFAULT_TEXTS_ERROR,
  };
}

export function orderDefaultTexts(payload) {
  return {
    type: ORDER_DEFAULT_TEXTS,
    payload,
  };
}
