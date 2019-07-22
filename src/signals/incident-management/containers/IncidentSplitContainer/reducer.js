import produce from 'immer';
import { SPLIT_INCIDENT, SPLIT_INCIDENT_SUCCESS, SPLIT_INCIDENT_ERROR } from './constants';

export const initialState = {
  split: false,
  loading: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SPLIT_INCIDENT:
        draft.loading = true;
        break;

      case SPLIT_INCIDENT_SUCCESS:
        draft.split = action.payload;
        draft.loading = false;
        break;

      case SPLIT_INCIDENT_ERROR:
        draft.error = action.payload;
        draft.split = action.payload;
        draft.loading = false;
        break;
    }
  });
