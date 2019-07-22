import produce from 'immer';
import { REQUEST_HISTORY_LIST, REQUEST_HISTORY_LIST_SUCCESS, REQUEST_HISTORY_LIST_ERROR } from './constants';

export const initialState = {
  list: [],
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_HISTORY_LIST:
        draft.loading = true;
        draft.error = false;
        break;

      case REQUEST_HISTORY_LIST_SUCCESS:
        draft.list = action.payload;
        draft.loading = false;
        break;

      case REQUEST_HISTORY_LIST_ERROR:
        draft.error = action.payload;
        draft.loading = false;
        break;
    }
  });
