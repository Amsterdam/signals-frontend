/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED, SORT_INCIDENTS_CHANGED, MAIN_CATEGORY_FILTER_SELECTION_CHANGED } from './constants';
import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';
import statusList from '../../definitions/statusList';
import filterSubcategories from './services/filter-subcategories';

export const initialState = fromJS({
  incidents: [],
  priorityList,
  stadsdeelList,
  filterMainCategoryList: [],
  filterSubCategoryList: [],
  statusList,
  sort: '-created_at'
});

function overviewPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', fromJS(action.payload.results))
        .set('incidentsCount', action.payload.count)
        .set('loading', false);
    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    case FILTER_INCIDENTS_CHANGED:
      return state
        .set('filter', action.payload)
        .set('page', 1);
    case PAGE_INCIDENTS_CHANGED:
      return state
        .set('page', action.payload);
    case SORT_INCIDENTS_CHANGED:
      return state
        .set('page', 1)
        .set('sort', action.payload);
    case MAIN_CATEGORY_FILTER_SELECTION_CHANGED:
      return state
        .set('filterMainCategoryList', fromJS(action.payload.selectedOptions))
        .set('filterSubCategoryList', fromJS(filterSubcategories(action.payload.selectedOptions, action.payload.categories)));
    default:
      return state;
  }
}

export default overviewPageReducer;
