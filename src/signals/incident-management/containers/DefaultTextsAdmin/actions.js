import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR
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
