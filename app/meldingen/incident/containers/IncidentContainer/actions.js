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
  GET_CLASSIFICATION_ERROR
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

export function createIncidentError(message) {
  return {
    type: CREATE_INCIDENT_ERROR,
    message
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
    ...classification
  };
}

export function getClassificationError(message) {
  return {
    type: GET_CLASSIFICATION_ERROR,
    message
  };
}
