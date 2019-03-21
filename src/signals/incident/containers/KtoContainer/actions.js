import {
  UPDATE_KTA,
  REQUEST_KTA_ANSWERS, REQUEST_KTA_ANSWERS_SUCCESS, REQUEST_KTA_ANSWERS_ERROR,
  CHECK_KTO, CHECK_KTO_SUCCESS, CHECK_KTO_ERROR,
  STORE_KTO, STORE_KTO_SUCCESS, STORE_KTO_ERROR
} from './constants';

export function updateKto(payload) {
  return {
    type: UPDATE_KTA,
    payload
  };
}

export function requestKtaAnswers(payload) {
  return {
    type: REQUEST_KTA_ANSWERS,
    payload
  };
}

export function requestKtaAnswersSuccess(payload) {
  return {
    type: REQUEST_KTA_ANSWERS_SUCCESS,
    payload
  };
}

export function requestKtaAnswersError(error) {
  return {
    type: REQUEST_KTA_ANSWERS_ERROR,
    payload: error
  };
}

export function checkKto(payload) {
  return {
    type: CHECK_KTO,
    payload
  };
}

export function checkKtoSuccess(payload) {
  return {
    type: CHECK_KTO_SUCCESS,
    payload
  };
}

export function checkKtoError(error) {
  return {
    type: CHECK_KTO_ERROR,
    payload: error
  };
}

export function storeKto(payload) {
  return {
    type: STORE_KTO,
    payload
  };
}

export function storeKtoSuccess(payload) {
  return {
    type: STORE_KTO_SUCCESS,
    payload
  };
}

export function storeKtoError(error) {
  return {
    type: STORE_KTO_ERROR,
    payload: error
  };
}
