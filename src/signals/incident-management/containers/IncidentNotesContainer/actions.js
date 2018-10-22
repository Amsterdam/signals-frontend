import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR,
  REQUEST_NOTE_CREATE, REQUEST_NOTE_CREATE_SUCCESS, REQUEST_NOTE_CREATE_ERROR
}
  from './constants';

export function requestNotesList(signalId) {
  return {
    type: REQUEST_NOTES_LIST,
    payload: signalId
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

export function requestNoteCreate(note) {
  return {
    type: REQUEST_NOTE_CREATE,
    payload: note
  };
}

export function requestNoteCreateSuccess(note) {
  return {
    type: REQUEST_NOTE_CREATE_SUCCESS,
    payload: note
  };
}

export function requestNoteCreateError(message) {
  return {
    type: REQUEST_NOTE_CREATE_ERROR,
    payload: message
  };
}
