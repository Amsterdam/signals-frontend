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
  // GET_CLASSIFICATION_ERROR,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

export function setIncident(incident) {
  return {
    type: SET_INCIDENT,
    incident
  };
}

export function createIncident(incident, wizard) {
  return {
    type: CREATE_INCIDENT,
    incident,
    wizard
  };
}

export function createIncidentSuccess(incident) {
  return {
    type: CREATE_INCIDENT_SUCCESS,
    incident
  };
}

export function createIncidentError(error) {
  return {
    type: CREATE_INCIDENT_ERROR,
    error
  };
}

export function getClassification(text) {
  return {
    type: GET_CLASSIFICATION,
    text
  };
}

export function getClassificationSuccess(classification) {
  return {
    type: GET_CLASSIFICATION_SUCCESS,
    payload: { ...classification }
  };
}

// export function getClassificationError(error) {
  // return {
    // type: GET_CLASSIFICATION_ERROR,
    // error
  // };
// }

export function uploadRequest(file, id) {
  return {
    type: UPLOAD_REQUEST,
    payload: file,
    meta: { id }
  };
}

export function uploadProgress(file, progress) {
  return {
    type: UPLOAD_PROGRESS,
    payload: progress,
    meta: { file },
  };
}

export function uploadSuccess(file) {
  return {
    type: UPLOAD_SUCCESS,
    meta: { file }
  };
}

export function uploadFailure(file, err) {
  return {
    type: UPLOAD_FAILURE,
    payload: err,
    error: true,
    meta: { file },
  };
}
