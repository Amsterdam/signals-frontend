/*
 *
 * NotesModel reducer
 *
 */

import { fromJS } from 'immutable';
import {
  REQUEST_NOTES_LIST,
  REQUEST_NOTES_LIST_SUCCESS,
  REQUEST_NOTES_LIST_ERROR,
  REQUEST_ADD_NOTE
} from './constants';

export const initialState = fromJS({
  id: null,
  incidentNotesList: []
});

function notesModelReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_NOTES_LIST:
      return state
        .set('loading', true)
        .set('error', false);

    case REQUEST_NOTES_LIST_SUCCESS:
      return state
        .set('incidentNotesList', fromJS(action.payload.results))
        .set('loading', false)
        .set('error', false);

    case REQUEST_NOTES_LIST_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);

    case REQUEST_ADD_NOTE:
      return state
        .set('incidentNotesList', fromJS([action.payload, ...state.get('incidentNotesList')]));

    default:
      return state;
  }
}

export default notesModelReducer;
