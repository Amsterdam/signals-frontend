import produce from 'immer';
import { REQUEST_DASHBOARD, REQUEST_DASHBOARD_SUCCESS, REQUEST_DASHBOARD_ERROR } from './constants';
import statusList from '../../definitions/statusList';

export const initialState = {
  dashboard: {},
  statusList,
  loading: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_DASHBOARD:
        draft.loading = true;
        break;

      case REQUEST_DASHBOARD_SUCCESS:
        draft.dashboard = action.payload;
        draft.loading = false;
        break;

      case REQUEST_DASHBOARD_ERROR:
        draft.loading = false;
        draft.error = true;
        break;
    }
  });
