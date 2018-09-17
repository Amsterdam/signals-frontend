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

  SET_PRIORITY,
  SET_PRIORITY_SUCCESS
} from './constants';

export function setIncident(incident) {
  return {
    type: SET_INCIDENT,
    payload: { ...incident }
  };
}

export function createIncident(payload) {
  return {
    type: CREATE_INCIDENT,
    payload
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
    payload: text
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

export function setPriority(payload) {
  return {
    type: SET_PRIORITY,
    payload
  };
}

export function setPrioritySuccess() {
  return {
    type: SET_PRIORITY_SUCCESS
  };
}
