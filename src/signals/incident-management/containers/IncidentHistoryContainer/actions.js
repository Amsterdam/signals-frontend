import {
  REQUEST_HISTORY_LIST, REQUEST_HISTORY_LIST_SUCCESS, REQUEST_HISTORY_LIST_ERROR
}
  from './constants';

export function requestHistoryList(signalId) {
  return {
    type: REQUEST_HISTORY_LIST,
    payload: signalId
  };
}

export function requestHistoryListSuccess(incidentHistoryList) {
  return {
    type: REQUEST_HISTORY_LIST_SUCCESS,
    payload: incidentHistoryList
  };
}

export function requestHistoryListError(message) {
  return {
    type: REQUEST_HISTORY_LIST_ERROR,
    payload: message
  };
}
