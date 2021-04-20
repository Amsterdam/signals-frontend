// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
export const UPDATE_INCIDENT = 'sia/IncidentContainer/UPDATE_INCIDENT'
export const RESET_INCIDENT = 'sia/IncidentContainer/RESET_INCIDENT'
export const REMOVE_QUESTION_DATA = 'src/IncidentContainer/REMOVE_QUESTION_DATA'

export const CREATE_INCIDENT = 'sia/IncidentContainer/CREATE_INCIDENT'
export const CREATE_INCIDENT_SUCCESS =
  'sia/IncidentContainer/CREATE_INCIDENT_SUCCESS'
export const CREATE_INCIDENT_ERROR =
  'sia/IncidentContainer/CREATE_INCIDENT_ERROR'

export const GET_CLASSIFICATION = 'sia/IncidentContainer/GET_CLASSIFICATION'
export const GET_CLASSIFICATION_SUCCESS =
  'sia/IncidentContainer/GET_CLASSIFICATION_SUCCESS'
export const GET_CLASSIFICATION_ERROR =
  'sia/IncidentContainer/GET_CLASSIFICATION_ERROR'
export const SET_CLASSIFICATION = 'sia/IncidentContainer/SET_CLASSIFICATION'

export const RESET_EXTRA_STATE = 'src/IncidentContainer/RESET_EXTRA_STATE'

export const GET_QUESTIONS = 'sia/IncidentContainer/GET_QUESTIONS'
export const GET_QUESTIONS_SUCCESS =
  'sia/IncidentContainer/GET_QUESTIONS_SUCCESS'
export const GET_QUESTIONS_ERROR = 'sia/IncidentContainer/GET_QUESTIONS_ERROR'

export const FIELD_TYPE_MAP = {
  checkbox_input: 'CheckboxInput',
  container_select: 'ContainerSelectRenderer',
  date_time_input: 'DateTimeInput',
  description_with_classification_input: 'DescriptionInputRenderer',
  emphasis_checkbox_input: 'EmphasisCheckboxInput',
  file_input: 'FileInputRenderer',
  handling_message: 'HandlingMessage',
  header: 'Header',
  hidden_input: 'HiddenInput',
  map_input: 'MapInput',
  map_select: 'MapSelect',
  multi_text_input: 'MultiTextInput',
  plain_text: 'PlainText',
  radio_input: 'RadioInputGroup',
  select_input: 'SelectInput',
  text_input: 'TextInput',
  textarea_input: 'TextareaInput',
}

export const INPUT_VALIDATOR_MAP = {
  email: 'email',
  max: 'max',
  max_length: 'maxLength',
  min: 'min',
  min_length: 'minLength',
  pattern: 'pattern',
  required: 'required',
  required_true: 'requiredTrue',
}
