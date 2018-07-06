/*
 *
 * IncidentDetailPage actions
 *
 */

import { REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR } from './constants';

export function requestIncident(id) {
  console.log(id);
  return {
    type: REQUEST_INCIDENT,
    payload: id
  };
}

export function requestIncidentSuccess(incident) {
  return {
    type: REQUEST_INCIDENT_SUCCESS,
    payload: incident
  };
}

export function requestIncidentError(message) {
  return {
    type: REQUEST_INCIDENT_ERROR,
    payload: message
  };
}
