import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  SET_CLASSIFICATION,
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_ERROR,
  RESET_EXTRA_STATE,
  REMOVE_QUESTION_DATA,
} from './constants';

export const updateIncident = payload => ({
  type: UPDATE_INCIDENT,
  payload,
});

export const removeQuestionData = payload => ({
  type: REMOVE_QUESTION_DATA,
  payload,
});

export const resetIncident = () => ({
  type: RESET_INCIDENT,
});

export const createIncident = payload => ({
  type: CREATE_INCIDENT,
  payload,
});

export const createIncidentSuccess = payload => ({
  type: CREATE_INCIDENT_SUCCESS,
  payload,
});

export const createIncidentError = () => ({
  type: CREATE_INCIDENT_ERROR,
});

export const getClassification = payload => ({
  type: GET_CLASSIFICATION,
  payload,
});

export const getClassificationSuccess = payload => ({
  type: GET_CLASSIFICATION_SUCCESS,
  payload,
});

export const getClassificationError = payload => ({
  type: GET_CLASSIFICATION_ERROR,
  payload,
});

export const setClassification = payload => ({
  type: SET_CLASSIFICATION,
  payload,
});

export const getQuestions = payload => ({
  type: GET_QUESTIONS,
  payload,
});

export const getQuestionsSuccess = payload => ({
  type: GET_QUESTIONS_SUCCESS,
  payload,
});

export const getQuestionsError = payload => ({
  type: GET_QUESTIONS_ERROR,
  payload,
});

export const resetExtraState = () => ({
  type: RESET_EXTRA_STATE,
});
