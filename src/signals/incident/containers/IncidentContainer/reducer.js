import produce from 'immer';

import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  SET_PRIORITY,
  SET_PRIORITY_SUCCESS,
  SET_PRIORITY_ERROR,
} from './constants';

export const initialState = {
  incident: {
    incident_date: 'Vandaag',
    incident_time_hours: 9,
    incident_time_minutes: 0,
    priority: {
      id: 'normal',
      label: 'Normaal',
    },
  },
  priority: {},
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_INCIDENT:
        draft.incident = {
          ...state.incident,
          ...action.payload,
        };
        break;

      case RESET_INCIDENT:
        draft.incident = {
          ...initialState.incident,
        };
        break;

      case CREATE_INCIDENT:
        draft.loading = true;
        draft.error = false;
        draft.incident = {
          ...state.incident,
          id: null,
        };
        break;

      case CREATE_INCIDENT_SUCCESS:
        draft.loading = false;
        draft.incident = {
          ...initialState.incident,
          id: action.payload.id,
          handling_message: state.incident.handling_message,
        };
        break;

      case CREATE_INCIDENT_ERROR:
        draft.error = true;
        draft.loading = false;
        break;

      case GET_CLASSIFICATION_SUCCESS:
      case GET_CLASSIFICATION_ERROR:
        draft.incident = {
          ...state.incident,
          ...action.payload,
        };
        break;

      case SET_PRIORITY:
        draft.priority = action.payload;
        break;

      case SET_PRIORITY_SUCCESS:
      case SET_PRIORITY_ERROR:
        draft.priority = {};
        break;
    }
  });
