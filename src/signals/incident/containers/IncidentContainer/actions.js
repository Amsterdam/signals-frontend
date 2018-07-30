/*
 *
 * IncidentContainer actions
 *
 */

import {
  SET_INCIDENT,

  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,

  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

export function setIncident(incident) {
  return {
    type: SET_INCIDENT,
    payload: { ...incident }
  };
}

export function createIncident(incident, wizard) {
  return {
    type: CREATE_INCIDENT,
    payload: {
      incident: { ...incident },
      wizard: { ...wizard }
    }
  };
}

export function createIncidentSuccess(incident) {
  return {
    type: CREATE_INCIDENT_SUCCESS,
    payload: { ...incident }
  };
}

export function createIncidentError() {
  return {
    type: CREATE_INCIDENT_ERROR
  };
}

export function getClassification(text) {
  return {
    type: GET_CLASSIFICATION,
    payload: { text }
  };
}

export function getClassificationSuccess(classification) {
  return {
    type: GET_CLASSIFICATION_SUCCESS,
    payload: { ...classification }
  };
}

export function getClassificationError(classification) {
  return {
    type: GET_CLASSIFICATION_ERROR,
    payload: { ...classification }
  };
}

export function uploadRequest(file, id) {
  return {
    type: UPLOAD_REQUEST,
    payload: { file, id }
  };
}

export function uploadProgress(file, progress) {
  return {
    type: UPLOAD_PROGRESS,
    payload: { file, progress }
  };
}

export function uploadSuccess(file) {
  return {
    type: UPLOAD_SUCCESS,
    payload: { file }
  };
}

export function uploadFailure(file, error) {
  return {
    type: UPLOAD_FAILURE,
    payload: { file, error }
  };
}
