/*
 *
 * OverviewPage actions
 *
 */

import {
  REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR,
  INCIDENT_SELECTED, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED, MAIN_CATEGORY_FILTER_SELECTION_CHANGED
}
  from './constants';

export function requestIncidents({ filter, page, sort }) {
  return {
    type: REQUEST_INCIDENTS,
    payload: { filter, page, sort }
  };
}

export function requestIncidentsSuccess(incidents) {
  return {
    type: REQUEST_INCIDENTS_SUCCESS,
    payload: incidents
  };
}

export function requestIncidentsError(message) {
  return {
    type: REQUEST_INCIDENTS_ERROR,
    payload: message
  };
}

export function incidentSelected(incident) {
  return {
    type: INCIDENT_SELECTED,
    payload: incident
  };
}

export function filterIncidentsChanged(filter) {
  return {
    type: FILTER_INCIDENTS_CHANGED,
    payload: filter
  };
}

export function pageIncidentsChanged(page) {
  return {
    type: PAGE_INCIDENTS_CHANGED,
    payload: page
  };
}

export function sortIncidentsChanged(sort) {
  return {
    type: SORT_INCIDENTS_CHANGED,
    payload: sort
  };
}

export function mainCategoryFilterSelectionChanged({ selectedOptions, categories }) {
  return {
    type: MAIN_CATEGORY_FILTER_SELECTION_CHANGED,
    payload: { selectedOptions, categories }
  };
}
