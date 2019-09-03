/*
 *
 * OverviewPage actions
 *
 */

import {
  REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR,
  INCIDENT_SELECTED, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED,
  GET_FILTERS,
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED,
  REMOVE_FILTER,
  REMOVE_FILTER_SUCCESS,
  REMOVE_FILTER_FAILED,
  REVERT_FILTER,
  REVERT_FILTER_SUCCESS,
  REVERT_FILTER_FAILED,
  APPLY_FILTER,
  EMPTY_REVERTED,
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

export const getFilters = () => ({
  type: GET_FILTERS
});

export const getFiltersSuccess = (payload) => ({
  type: GET_FILTERS_SUCCESS,
  payload,
});

export const getFiltersFailed = (payload) => ({
  type: GET_FILTERS_FAILED,
  payload,
});

export const removeFilter = (payload) => ({
  type: REMOVE_FILTER,
  payload,
});

export const removeFilterSuccess = (payload) => ({
  type: REMOVE_FILTER_SUCCESS,
  payload,
});

export const removeFilterFailed = (payload) => ({
  type: REMOVE_FILTER_FAILED,
  payload,
});

export const revertFilter = () => ({
  type: REVERT_FILTER
});

export const revertFilterSuccess = () => ({
  type: REVERT_FILTER_SUCCESS
});

export const revertFilterFailed = () => ({
  type: REVERT_FILTER_FAILED
});

export const applyFilter = (payload) => ({
  type: APPLY_FILTER,
  payload,
});

export const emptyReverted = () => ({
  type: EMPTY_REVERTED
});
