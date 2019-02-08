/*
 *
 * NotesModel actions
 *
 */

import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR, REQUEST_ADD_NOTE
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

export function requestAddNote(newNote) {
  return {
    type: REQUEST_ADD_NOTE,
    payload: newNote
  };
}
