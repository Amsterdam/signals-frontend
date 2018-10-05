import {
  REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR,
  REQUEST_CATEGORIES, REQUEST_CATEGORIES_SUCCESS, REQUEST_CATEGORIES_ERROR,
  INCIDENT_SELECTED, FILTER_INCIDENTS_CHANGED,
  MAIN_CATEGORY_FILTER_SELECTION_CHANGED
} from './constants';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  requestCategories,
  requestCategoriesSuccess,
  requestCategoriesError,
  incidentSelected,
  filterIncidentsChanged,
  mainCategoryFilterSelectionChanged
} from './actions';

import { testActionCreator } from '../../../../../internals/testing/test-utils';

describe('OverviewPage actions', () => {
  it('should be created', () => {
    const payload = { filter: {}, page: {} };
    testActionCreator(requestIncidents, REQUEST_INCIDENTS, payload);
    testActionCreator(requestIncidentsSuccess, REQUEST_INCIDENTS_SUCCESS, payload);
    testActionCreator(requestIncidentsError, REQUEST_INCIDENTS_ERROR, payload);
    testActionCreator(requestCategories, REQUEST_CATEGORIES);
    testActionCreator(requestCategoriesSuccess, REQUEST_CATEGORIES_SUCCESS, payload);
    testActionCreator(requestCategoriesError, REQUEST_CATEGORIES_ERROR, payload);
    testActionCreator(incidentSelected, INCIDENT_SELECTED, payload);
    testActionCreator(filterIncidentsChanged, FILTER_INCIDENTS_CHANGED, payload);
    testActionCreator(mainCategoryFilterSelectionChanged, MAIN_CATEGORY_FILTER_SELECTION_CHANGED, payload);
  });
});
