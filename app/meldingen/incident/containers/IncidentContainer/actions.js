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

export function createIncident(incident) {
  return {
    type: CREATE_INCIDENT,
    incident
  };
}

export function createIncidentSuccess(incident) {
  return {
    type: CREATE_INCIDENT_SUCCESS,
    incident
  };
}

export function setIncidentError(message) {
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

export function getClassificationSuccess(text) {
  return {
    type: GET_CLASSIFICATION_SUCCESS,
    text
  };
}

export function getClassificationError(message) {
  return {
    type: GET_CLASSIFICATION_ERROR,
    message
  };
}
