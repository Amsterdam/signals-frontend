import { fromJS } from 'immutable';
import {
  REQUEST_NOTE_CREATE,
  REQUEST_NOTE_CREATE_SUCCESS,
  REQUEST_NOTE_CREATE_ERROR
}
  from './constants';

export const initialState = fromJS({
  incidentNotesList: [],
  loading: false
});

function incidentNotesContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_NOTE_CREATE:
      return state
        .set('loading', true)
        .set('error', false);

    case REQUEST_NOTE_CREATE_SUCCESS:
      return state
        .set('incidentNotesList', fromJS([action.payload, ...state.get('incidentNotesList')]))
        .set('loading', false);

    case REQUEST_NOTE_CREATE_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default incidentNotesContainerReducer;
