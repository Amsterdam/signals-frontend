/*
 *
 * IncidentDetailPage actions
 *
 */

import { REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR } from './constants';

export function requestIncident(id) {
  return {
    type: REQUEST_INCIDENT,
    id
  };
}

export function requestIncidentSuccess(incident) {
  return {
    type: REQUEST_INCIDENT_SUCCESS,
    incident
  };
}

export function requestIncidentError(message) {
  return {
    type: REQUEST_INCIDENT_ERROR,
    message
  };
}
