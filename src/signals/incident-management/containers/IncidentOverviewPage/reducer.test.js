
import { fromJS } from 'immutable';

import overviewPageReducer, { initialState } from './reducer';
import filterSubcategories from './services/filter-subcategories';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged,
  pageIncidentsChanged,
  sortIncidentsChanged,
  mainCategoryFilterSelectionChanged
} from './actions';

jest.mock('./services/filter-subcategories');

describe('overviewPageReducer', () => {
  let state;

  beforeEach(() => {
    filterSubcategories.mockImplementation(() => [
      {
        key: '',
        value: 'Alles',
        slug: ''
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
        value: 'Dode dieren',
        slug: 'dode-dieren'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/meeuwen',
        value: 'Meeuwen',
        slug: 'meeuwen'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren',
        value: 'Overig dieren',
        slug: 'overig-dieren'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ratten',
        value: 'Ratten',
        slug: 'ratten'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/wespen',
        value: 'Wespen',
        slug: 'wespen'
      }
    ]);
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
      .set('incidents', fromJS(payload.results))
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

  it('should handle the PAGE_INCIDENTS_CHANGED', () => {
    const page = 1;
    const action = pageIncidentsChanged(page);
    const expected = fromJS({})
      .set('page', 1);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the SORT_INCIDENTS_CHANGED', () => {
    const sort = '-created_at';
    const action = sortIncidentsChanged(sort);
    const expected = fromJS({})
      .set('page', 1)
      .set('sort', sort);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the MAIN_CATEGORY_FILTER_SELECTION_CHANGED', () => {
    const payload = { selectedOptions: ['overlast-van-dieren'], categories: {} };
    const action = mainCategoryFilterSelectionChanged(payload);
    const expected = fromJS({})
      .set('filterMainCategoryList', fromJS(action.payload.selectedOptions))
      .set('filterSubCategoryList', fromJS(filterSubcategories(action.payload.selectedOptions, action.payload.categories)));
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });
});
