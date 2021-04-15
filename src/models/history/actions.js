// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import {
  REQUEST_HISTORY_LIST,
  REQUEST_HISTORY_LIST_SUCCESS,
  REQUEST_HISTORY_LIST_ERROR,
} from './constants'

export function requestHistoryList(signalId) {
  return {
    type: REQUEST_HISTORY_LIST,
    payload: signalId,
  }
}

export function requestHistoryListSuccess(payload) {
  return {
    type: REQUEST_HISTORY_LIST_SUCCESS,
    payload,
  }
}

export function requestHistoryListError(message) {
  return {
    type: REQUEST_HISTORY_LIST_ERROR,
    payload: message,
  }
}
