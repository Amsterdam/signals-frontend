import produce from 'immer';
import {
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  FILTER_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED,
  MAIN_CATEGORY_FILTER_SELECTION_CHANGED,
} from './constants';
import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';
import statusList from '../../definitions/statusList';
import filterSubcategories from './services/filter-subcategories';

export const initialState = {
  incidents: [],
  priorityList,
  stadsdeelList,
  filterSubCategoryList: [],
  statusList,
  sort: '-created_at',
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

      case MAIN_CATEGORY_FILTER_SELECTION_CHANGED:
        draft.filterSubCategoryList = filterSubcategories(action.payload.selectedOptions, action.payload.categories);
        break;
    }
  });
