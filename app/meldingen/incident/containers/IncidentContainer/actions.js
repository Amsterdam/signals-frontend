/*
 *
 * IncidentContainer actions
 *
 */

import {
  SET_INCIDENT,
  SEND_INCIDENT,
  SEND_INCIDENT_SUCCESS,
  SEND_INCIDENT_ERROR
} from './constants';

export function setIncident(incident) {
  return {
    type: SET_INCIDENT,
    incident
  };
}

export function sendIncident(incident) {
  return {
    type: SEND_INCIDENT,
    incident
  };
}

export function sendIncidentSuccess(incident) {
  return {
    type: SEND_INCIDENT_SUCCESS,
    incident
  };
}

export function setIncidentError(message) {
  return {
    type: SEND_INCIDENT_ERROR,
    message
  };
}
