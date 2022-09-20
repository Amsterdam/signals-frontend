// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { QuestionFieldType } from 'types/question'

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
export const SET_LOADING_DATA = 'sia/IncidentContainer/SET_LOADING_DATA'

export const SHOW_MAP = 'sia/IncidentContainer/SHOW_MAP'
export const CLOSE_MAP = 'sia/IncidentContainer/CLOSE_MAP'

export const ADD_TO_SELECTION = 'sia/IncidentContainer/ADD_TO_SELECTION'
export const REMOVE_FROM_SELECTION =
  'sia/IncidentContainer/REMOVE_FROM_SELECTION'

export const LOCATION_SELECT_FIELD_TYPE = 'location_select'

export const FIELD_TYPE_MAP = {
  asset_select: QuestionFieldType.AssetSelect,
  caterpillar_select: QuestionFieldType.CaterpillarSelect,
  checkbox_input: QuestionFieldType.CheckboxInput,
  clock_select: QuestionFieldType.ClockSelect,
  date_time_input: QuestionFieldType.DateTimeInput,
  description_with_classification_input: QuestionFieldType.DescriptionInput,
  emphasis_checkbox_input: QuestionFieldType.EmphasisCheckboxInput,
  file_input: QuestionFieldType.FileInput,
  handling_message: QuestionFieldType.HandlingMessage,
  header: QuestionFieldType.Header,
  hidden_input: QuestionFieldType.HiddenInput,
  [LOCATION_SELECT_FIELD_TYPE]: QuestionFieldType.LocationSelect,
  map_input: QuestionFieldType.MapInput,
  multi_text_input: QuestionFieldType.MultiTextInput,
  plain_text: QuestionFieldType.PlainText,
  radio_input: QuestionFieldType.RadioInput,
  select_input: QuestionFieldType.SelectInput,
  streetlight_select: QuestionFieldType.StreetlightSelect,
  text_input: QuestionFieldType.TextInput,
  textarea_input: QuestionFieldType.TextareaInput,
}

export const INPUT_VALIDATOR_MAP = {
  email: 'email',
  max: 'max',
  maxLength: 'maxLength',
  min: 'min',
  minLength: 'minLength',
  pattern: 'pattern',
  required: 'required',
  required_true: 'requiredTrue',
}
