// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { Reducer } from 'react'
import {
  CLOSE_ALL,
  EDIT,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  RESET,
  SET_ATTACHMENTS,
  SET_CHILDREN,
  SET_CHILDREN_HISTORY,
  SET_CHILD_INCIDENTS,
  SET_CONTEXT,
  SET_DEFAULT_TEXTS,
  SET_ERROR,
  SET_HISTORY,
  SET_INCIDENT,
} from './constants'

import type { IncidentDetailAction as Action } from './actions'
import type { State } from './types'

export const initialState: State = {
  attachmentHref: undefined,
  attachments: undefined,
  children: undefined,
  childrenHistory: undefined,
  childIncidents: undefined,
  context: undefined,
  defaultTexts: undefined,
  error: undefined,
  history: undefined,
  incident: undefined,
  patching: undefined,
}

// values that will be set whenever the CLOSE_ALL type is dispatched
export const closedState = {
  preview: undefined,
  edit: undefined,
  error: undefined,
  attachmentHref: '',
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case CLOSE_ALL:
      return { ...state, ...closedState }

    case SET_ERROR:
      return { ...state, error: action.payload }

    case SET_ATTACHMENTS:
      return { ...state, attachments: action.payload }

    case SET_HISTORY:
      return { ...state, history: action.payload }

    case SET_CHILDREN:
      return { ...state, children: action.payload }

    case SET_CHILDREN_HISTORY:
      return { ...state, childrenHistory: action.payload }

    case SET_CHILD_INCIDENTS:
      return { ...state, childIncidents: action.payload }

    case SET_CONTEXT:
      return { ...state, context: action.payload }

    case SET_DEFAULT_TEXTS:
      return { ...state, defaultTexts: action.payload }

    case SET_INCIDENT:
      return { ...state, incident: action.payload }

    case PATCH_START:
      return { ...state, patching: action.payload }

    case PATCH_SUCCESS:
      return { ...state, patching: undefined }

    case PREVIEW:
      return {
        ...state,
        edit: undefined,
        ...action.payload,
        preview: action.payload?.preview,
      }

    case EDIT:
      return {
        ...state,
        preview: undefined,
        ...action.payload,
        edit: action.payload?.edit,
      }

    case RESET:
      return { ...initialState, incident: state.incident }

    default:
      return state
  }
}

export default reducer
