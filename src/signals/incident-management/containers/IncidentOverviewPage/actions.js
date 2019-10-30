import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  FILTER_INCIDENTS_CHANGED,
  INCIDENT_SELECTED,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
} from './constants';

export function requestIncidents() {
  return {
    type: REQUEST_INCIDENTS,
  };
}

export function requestIncidentsSuccess(incidents) {
  return {
    type: REQUEST_INCIDENTS_SUCCESS,
    payload: incidents,
  };
}

export function requestIncidentsError(message) {
  return {
    type: REQUEST_INCIDENTS_ERROR,
    payload: message,
  };
}

export function incidentSelected(incident) {
  return {
    type: INCIDENT_SELECTED,
    payload: incident,
  };
}

export function filterIncidentsChanged(filter) {
  return {
    type: FILTER_INCIDENTS_CHANGED,
    payload: filter,
  };
}

export const applyFilterRefresh = () => ({
  type: APPLY_FILTER_REFRESH,
});

export const applyFilterRefreshStop = () => ({
  type: APPLY_FILTER_REFRESH_STOP,
});
