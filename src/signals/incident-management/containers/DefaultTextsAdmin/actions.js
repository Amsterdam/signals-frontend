import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS_SUCCESS, STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS, SAVE_DEFAULT_TEXTS_ITEM
} from './constants';

export function fetchDefaultTexts(payload) {
  return {
    type: FETCH_DEFAULT_TEXTS,
    payload
  };
}

export function fetchDefaultTextsSuccess(payload) {
  return {
    type: FETCH_DEFAULT_TEXTS_SUCCESS,
    payload
  };
}

export function fetchDefaultTextsError(error) {
  return {
    type: FETCH_DEFAULT_TEXTS_ERROR,
    payload: error
  };
}

export function storeDefaultTexts(payload) {
  return {
    type: STORE_DEFAULT_TEXTS,
    payload
  };
}

export function storeDefaultTextsSuccess(payload) {
  return {
    type: STORE_DEFAULT_TEXTS_SUCCESS,
    payload
  };
}

export function storeDefaultTextsError(error) {
  return {
    type: STORE_DEFAULT_TEXTS_ERROR,
    payload: error
  };
}

export function orderDefaultTexts(payload) {
  return {
    type: ORDER_DEFAULT_TEXTS,
    payload
  };
}

export function saveDefaultTextsItem(payload) {
  return {
    type: SAVE_DEFAULT_TEXTS_ITEM,
    payload
  };
}

