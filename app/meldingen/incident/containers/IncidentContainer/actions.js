/*
 *
 * IncidentContainer actions
 *
 */

import {
  SET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR
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
