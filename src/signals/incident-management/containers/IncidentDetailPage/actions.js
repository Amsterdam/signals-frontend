/*
 *
 * IncidentDetailPage actions
 *
 */

import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR
} from './constants';

export function requestIncident(id) {
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

export function requestNotesList(id) {
  return {
    type: REQUEST_NOTES_LIST,
    payload: id
  };
}

export function requestNotesListSuccess(incidentNotesList) {
  return {
    type: REQUEST_NOTES_LIST_SUCCESS,
    payload: incidentNotesList
  };
}

export function requestNotesListError(message) {
  return {
    type: REQUEST_NOTES_LIST_ERROR,
    payload: message
  };
}
