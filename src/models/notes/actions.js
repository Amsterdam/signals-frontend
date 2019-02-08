/*
 *
 * NotesModel actions
 *
 */

import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR
} from './constants';

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
