/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED, MAIN_CATEGORY_FILTER_SELECTION_CHANGED } from './constants';
import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';
import mainCategoryList from '../../definitions/categoryList';
import subcategoryList from '../../definitions/subcategoryList';
import mainToSubMap from '../../definitions/mainToSubMap';
import statusList from '../../definitions/statusList';

export const initialState = fromJS({
  incidents: [],
  priorityList,
  stadsdeelList,
  mainCategoryList,
  mainCategorySelectionList: [],
  subcategoryList,
  statusList
});

const filterSubcategories = (mainCategoryFilterSelection) => {
  if (!mainCategoryFilterSelection || mainCategoryFilterSelection === undefined) {
    return subcategoryList;
  }
  if (mainCategoryFilterSelection.length > 1 && mainCategoryFilterSelection.indexOf('') > -1) {
    // Do not select 'Alles' and other categories to prevent duplicates
    mainCategoryFilterSelection.splice(mainCategoryFilterSelection.indexOf(''), 1);
  }
  let filteredSubcategoryList = mainCategoryFilterSelection
    .flatMap((mainCategory) => mainToSubMap[mainCategory])
    .sort()
    .flatMap((s) => [{ key: s, value: s }]);
  filteredSubcategoryList = [{ key: '', value: 'Alles' }].concat(filteredSubcategoryList);
  return filteredSubcategoryList;
};

function overviewPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', action.payload.results)
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
    case MAIN_CATEGORY_FILTER_SELECTION_CHANGED:
      return state
        .set('mainCategorySelectionList', action.payload)
        .set('subcategoryList', filterSubcategories(action.payload));

    default:
      return state;
  }
}

export default overviewPageReducer;
