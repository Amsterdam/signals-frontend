import {
  UPDATE_KTA,
  REQUEST_KTA_ANSWERS, REQUEST_KTA_ANSWERS_SUCCESS, REQUEST_KTA_ANSWERS_ERROR
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
