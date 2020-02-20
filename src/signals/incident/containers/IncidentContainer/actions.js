/*
 *
 * IncidentContainer actions
 *
 */

import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
} from './constants';

export const updateIncident = payload => ({
  type: UPDATE_INCIDENT,
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
