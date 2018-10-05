
import { fromJS } from 'immutable';

import overviewPageReducer, { initialState } from './reducer';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  requestCategories,
  requestCategoriesSuccess,
  incidentSelected,
  filterIncidentsChanged,
  mainCategoryFilterSelectionChanged
} from './actions';

import subcategoryList from '../../definitions/subcategoryList';
import mainToSubMap from '../../definitions/mainToSubMap';

describe('overviewPageReducer', () => {
  let state;

  beforeEach(() => {
    state = fromJS({});
  });

  it('returns the initial state', () => {
    expect(overviewPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the REQUEST_INICDENTS', () => {
    const action = requestIncidents({});
    const expected = {
      loading: true,
      error: false
    };
    expect(overviewPageReducer(state, action)).toEqual(fromJS(expected));
  });

  it('should handle the REQUEST_INICDENTS_SUCCESS', () => {
    const payload = { count: 1, results: [1] };
    const action = requestIncidentsSuccess(payload);
    const expected = fromJS({})
      .set('incidents', payload.results)
      .set('incidentsCount', payload.count)
      .set('loading', false);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_INCIDENTS_ERROR', () => {
    const message = '';
    const action = requestIncidentsError(message);
    const expected = fromJS({})
      .set('error', message)
      .set('loading', false);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_CATEGORIES', () => {
    const action = requestCategories({});
    const expected = {
      loading: true,
      error: false
    };
    expect(overviewPageReducer(state, action)).toEqual(fromJS(expected));
  });

  it('should handle the REQUEST_CATEGORIES_SUCCESS', () => {
    const payload = { results: [1] };
    const action = requestCategoriesSuccess(payload);
    const expected = fromJS({})
      .set('allCategoryList', payload)
      .set('loading', false);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the INCIDENT_SELECTED', () => {
    const incident = {};
    const action = incidentSelected(incident);
    const expected = fromJS({});
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the FILTER_INCIDENTS_CHANGED', () => {
    const filter = {};
    const action = filterIncidentsChanged(filter);
    const expected = fromJS({})
      .set('filter', filter)
      .set('page', 1);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the MAIN_CATEGORY_FILTER_SELECTION_CHANGED for no selection', () => {
    const mainCategoryFilterSelection = null;
    const action = mainCategoryFilterSelectionChanged(mainCategoryFilterSelection);
    const expected = fromJS({})
      .set('mainCategorySelectionList', mainCategoryFilterSelection)
      .set('subcategoryList', subcategoryList);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the MAIN_CATEGORY_FILTER_SELECTION_CHANGED for Alles', () => {
    const mainCategoryFilterSelection = [''];
    const expectedSubcategoryList = [{ key: '', value: 'Alles' }].concat(mainToSubMap['']
      .sort()
      .flatMap((s) => [{ key: s, value: s }]));
    const action = mainCategoryFilterSelectionChanged(mainCategoryFilterSelection);
    const expected = fromJS({})
      .set('mainCategorySelectionList', mainCategoryFilterSelection)
      .set('subcategoryList', expectedSubcategoryList);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the MAIN_CATEGORY_FILTER_SELECTION_CHANGED for Alles and another main category', () => {
    const mainCategoryFilterSelection = ['', 'Overig'];
    const expectedSubcategoryList = [{ key: '', value: 'Alles' }];
    const action = mainCategoryFilterSelectionChanged(mainCategoryFilterSelection);
    const expected = fromJS({})
      .set('mainCategorySelectionList', mainCategoryFilterSelection)
      .set('subcategoryList', expectedSubcategoryList);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });
});
