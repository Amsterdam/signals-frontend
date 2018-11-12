import {
  REQUEST_PRIORITY_UPDATE,
  REQUEST_PRIORITY_UPDATE_SUCCESS,
  REQUEST_PRIORITY_UPDATE_ERROR
}
  from './constants';

export function requestPriorityUpdate(priority) {
  return {
    type: REQUEST_PRIORITY_UPDATE,
    payload: priority
  };
}

export function requestPriorityUpdateSuccess(priority) {
  return {
    type: REQUEST_PRIORITY_UPDATE_SUCCESS,
    payload: priority
  };
}

export function requestPriorityUpdateError(message) {
  return {
    type: REQUEST_PRIORITY_UPDATE_ERROR,
    payload: message
  };
}
