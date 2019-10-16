import {
  UPDATE_KTO,
  REQUEST_KTO_ANSWERS, REQUEST_KTO_ANSWERS_SUCCESS, REQUEST_KTO_ANSWERS_ERROR,
  CHECK_KTO, CHECK_KTO_SUCCESS, CHECK_KTO_ERROR,
  STORE_KTO, STORE_KTO_SUCCESS, STORE_KTO_ERROR,
} from './constants';

export function updateKto(payload) {
  return {
    type: UPDATE_KTO,
    payload,
  };
}

export function requestKtoAnswers(payload) {
  return {
    type: REQUEST_KTO_ANSWERS,
    payload,
  };
}

export function requestKtoAnswersSuccess(payload) {
  return {
    type: REQUEST_KTO_ANSWERS_SUCCESS,
    payload,
  };
}

export function requestKtoAnswersError() {
  return {
    type: REQUEST_KTO_ANSWERS_ERROR,
  };
}

export function checkKto(payload) {
  return {
    type: CHECK_KTO,
    payload,
  };
}

export function checkKtoSuccess(payload) {
  return {
    type: CHECK_KTO_SUCCESS,
    payload,
  };
}

export function checkKtoError(error) {
  return {
    type: CHECK_KTO_ERROR,
    payload: error,
  };
}

export function storeKto(payload) {
  return {
    type: STORE_KTO,
    payload,
  };
}

export function storeKtoSuccess() {
  return {
    type: STORE_KTO_SUCCESS,
  };
}

export function storeKtoError(error) {
  return {
    type: STORE_KTO_ERROR,
    payload: error,
  };
}
