/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR,
   FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED, MAIN_CATEGORY_FILTER_SELECTION_CHANGED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED,
}
  from './constants';
import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';
import statusList from '../../definitions/statusList';
import filterSubcategories from './services/filter-subcategories';

export const initialState = fromJS({
  filterSubCategoryList: [],
  incidents: [],
  incidentsCount: null,
  priorityList,
  sort: '-created_at',
  stadsdeelList,
  statusList,
  allFilters: [],
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
        .set('filter', fromJS(action.payload))
        .set('page', 1);
    case PAGE_INCIDENTS_CHANGED:
      return state
        .set('page', fromJS(action.payload));
    case SORT_INCIDENTS_CHANGED:
      return state
        .set('page', 1)
        .set('sort', fromJS(action.payload));
    case MAIN_CATEGORY_FILTER_SELECTION_CHANGED:
      return state
        .set('filterSubCategoryList', fromJS(filterSubcategories(action.payload.selectedOptions, action.payload.categories)));
    case GET_FILTERS_FAILED:
      return state
        .set('loading', false)
        .set('error', true)
        .set('errorMessage', action.payload);
    case GET_FILTERS_SUCCESS:
      return state
        .set('allFilters', fromJS(action.payload))
        .set('loading', false);

    default:
      return state;
  }
}

export default overviewPageReducer;
