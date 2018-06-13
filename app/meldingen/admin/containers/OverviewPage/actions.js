/*
 *
 * OverviewPage actions
 *
 */

import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, INCIDENT_SELECTED, FILTER_INCIDENTS_CHANGED } from './constants';

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

export function incidentSelected(incident) {
  return {
    type: INCIDENT_SELECTED,
    incident
  };
}

export function filterIncidentsChanged(filter) {
  return {
    type: FILTER_INCIDENTS_CHANGED,
    filter
  };
}
