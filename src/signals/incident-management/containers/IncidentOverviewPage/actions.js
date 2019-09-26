import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  FILTER_INCIDENTS_CHANGED,
  INCIDENT_SELECTED,
  PAGE_INCIDENTS_CHANGED,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  SORT_INCIDENTS_CHANGED,
} from './constants';

export function requestIncidents({ filter, page, sort }) {
  return {
    type: REQUEST_INCIDENTS,
    payload: { filter, page, sort },
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

export function pageIncidentsChanged(page) {
  return {
    type: PAGE_INCIDENTS_CHANGED,
    payload: page,
  };
}

export function sortIncidentsChanged(sort) {
  return {
    type: SORT_INCIDENTS_CHANGED,
    payload: sort,
  };
}

export const applyFilterRefresh = () => ({
  type: APPLY_FILTER_REFRESH,
});

export const applyFilterRefreshStop = (payload) => ({
  type: APPLY_FILTER_REFRESH_STOP,
  payload,
});
