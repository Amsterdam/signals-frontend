/*
 *
 * OverviewPage actions
 *
 */

import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, SELECT_INCIDENT, FILTER_INCIDENTS } from './constants';

export function requestIncidents(filter) {
  return {
    type: REQUEST_INCIDENTS,
    filter
  };
}

export function requestIncidentsSuccess(incidents) {
  return {
    type: REQUEST_INCIDENTS_SUCCESS,
    incidents
  };
}

export function requestIncidentsError(message) {
  return {
    type: REQUEST_INCIDENTS_ERROR,
    message
  };
}

export function selectIncident(incident) {
  return {
    type: SELECT_INCIDENT,
    incident
  };
}

export function filterIncidents(filter) {
  return {
    type: FILTER_INCIDENTS,
    filter
  };
}
