import {
  REQUEST_NOTE_CREATE, REQUEST_NOTE_CREATE_SUCCESS, REQUEST_NOTE_CREATE_ERROR
}
  from './constants';

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
