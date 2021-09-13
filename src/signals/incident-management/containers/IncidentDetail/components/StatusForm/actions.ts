// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Status } from 'signals/incident-management/definitions/types'

export type Action<T extends string = string, P = void> = {
  payload: P
  type: T
}

type SetStatusAction = Action<'SET_STATUS', Status>
type SetErrorsAction = Action<'SET_ERRORS', { text: string }>
type ToggleCheckAction = Action<'TOGGLE_CHECK'>
type SetDefaultTextAction = Action<'SET_DEFAULT_TEXT', string>
type SetTextAction = Action<'SET_TEXT', string>

export type StatusFormActions =
  | SetStatusAction
  | SetErrorsAction
  | ToggleCheckAction
  | SetDefaultTextAction
  | SetTextAction
