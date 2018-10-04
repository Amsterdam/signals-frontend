/*
 *
 * OverviewPage actions
 *
 */

import {
  REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR,
  REQUEST_CATEGORIES, REQUEST_CATEGORIES_SUCCESS, REQUEST_CATEGORIES_ERROR,
  INCIDENT_SELECTED, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED,
  MAIN_CATEGORY_FILTER_SELECTION_CHANGED
}
  from './constants';

export function requestIncidents({ filter, page }) {
  return {
    type: REQUEST_INCIDENTS,
    payload: { filter, page }
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

export function requestCategories() {
  return {
    type: REQUEST_CATEGORIES
  };
}

export function requestCategoriesSuccess(categories) {
  return {
    type: REQUEST_CATEGORIES_SUCCESS,
    payload: categories
  };
}

export function requestCategoriesError(message) {
  return {
    type: REQUEST_CATEGORIES_ERROR,
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

export function mainCategoryFilterSelectionChanged(selectedOptions) {
  return {
    type: MAIN_CATEGORY_FILTER_SELECTION_CHANGED,
    payload: selectedOptions
  };
}
