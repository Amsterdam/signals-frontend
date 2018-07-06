import {
  REQUEST_STATUS_LIST, REQUEST_STATUS_LIST_SUCCESS, REQUEST_STATUS_LIST_ERROR,
  REQUEST_STATUS_ADD, REQUEST_STATUS_ADD_SUCCESS, REQUEST_STATUS_ADD_ERROR
}
  from './constants';

export function requestsStatusList(signalId) {
  return {
    type: REQUEST_STATUS_LIST,
    payload: signalId
  };
}

export function requestsStatusListSuccess(statusList) {
  return {
    type: REQUEST_STATUS_LIST_SUCCESS,
    payload: statusList
  };
}

export function requestStatusListError(message) {
  return {
    type: REQUEST_STATUS_LIST_ERROR,
    payload: message
  };
}

export function requestsStatusAdd(status) {
  return {
    type: REQUEST_STATUS_ADD,
    payload: status
  };
}

export function requestsStatusAddSuccess(status) {
  return {
    type: REQUEST_STATUS_ADD_SUCCESS,
    payload: status
  };
}

export function requestStatusAddError(message) {
  return {
    type: REQUEST_STATUS_ADD_ERROR,
    payload: message
  };
}
