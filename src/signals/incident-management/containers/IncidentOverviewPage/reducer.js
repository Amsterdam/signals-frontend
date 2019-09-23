import produce from 'immer';
import {
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  FILTER_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED,
  REMOVE_FILTER_SUCCESS,
  APPLY_FILTER,
} from './constants';
import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';
import statusList from '../../definitions/statusList';
import feedbackList from '../../definitions/feedbackList';

export const initialState = {
  sort: '-created_at',
  page: 1,
  incidents: [],
  incidentsCount: null,
  priorityList,
  stadsdeelList,
  statusList,
  feedbackList,
  allFilters: [],
  filter: {},
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_INCIDENTS:
        draft.loading = true;
        draft.error = false;
        break;

      case REQUEST_INCIDENTS_SUCCESS:
        draft.incidents = action.payload.results;
        draft.incidentsCount = action.payload.count;
        draft.loading = false;
        break;

      case REQUEST_INCIDENTS_ERROR:
        draft.error = action.payload;
        draft.loading = false;
        break;

      case FILTER_INCIDENTS_CHANGED:
        draft.filter = action.payload;
        draft.page = 1;
        break;

      case PAGE_INCIDENTS_CHANGED:
        draft.page = action.payload;
        break;

      case SORT_INCIDENTS_CHANGED:
        draft.page = 1;
        draft.sort = action.payload;
        break;

      case GET_FILTERS_SUCCESS:
        draft.allFilters = action.payload;
        draft.loading = false;
        break;

      case GET_FILTERS_FAILED:
        draft.loading = false;
        draft.error = true;
        draft.errorMessage = action.payload;
        break;

      case REMOVE_FILTER_SUCCESS:
        const re = new RegExp(`/${action.payload}`, 'g');
        const newFilters = state.allFilters.filter(i => !i._links.self.href.match(re));
        draft.allFilters = newFilters;
        break;

      case APPLY_FILTER:
        draft.filter = action.payload;
        break;
    }
  });
