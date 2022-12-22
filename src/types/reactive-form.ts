// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

/**
 * Since we deprecated react-reactive-form I copied the types that are still used to this file.
 */

type Handler = {
  value: any
  onChange: (e: any) => void
  onBlur: (e: any) => void
  onFocus: (e: any) => void
  disabled: boolean
  checked?: boolean
  editable?: boolean
  type?: string
}

type InputType = 'checkbox' | 'radio' | 'switch'
type Status = 'VALID' | 'INVALID' | 'DISABLED' | 'PENDING'

type ValidationErrors = {
  [key: string]: any
}

/**
 * @description the Meta interface of the reactive-forms. Not exported from the package
 */
export interface ReactiveFormMeta {
  value: any
  disabled: boolean
  enabled: boolean
  invalid: boolean
  valid: boolean
  pristine: boolean
  dirty: boolean
  errors: ValidationErrors
  status: Status
  pending: boolean
  _pendingValue: any
  hasError: (errorCode: string, path?: string | number[] | string) => boolean
  getError: (errorCode: string, path?: string | number[] | string) => any
  handler: (inputType?: InputType, value?: string) => Handler
}

export interface FormMeta extends Record<string, unknown> {
  name?: string
  label?: string
  subtitle?: string
  placeholder?: string
  maxLength?: number
  autoRemove?: RegExp
  isVisible?: boolean
  autoComplete?: string
  type?: string
  newItemText?: string
  width?: string
}

export interface FormOptions {
  validators?: any
}

export interface ParentType {
  meta: { updateIncident: (data: any) => void }
}

type ReactiveFormPickedProps = 'handler' | 'hasError' | 'getError'
export interface FormInputProps<T = string>
  extends Pick<ReactiveFormMeta, ReactiveFormPickedProps> {
  meta?: FormMeta
  validatorsOrOpts?: FormOptions
  parent: ParentType
  value?: T
}
