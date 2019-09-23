import overviewPageReducer, { initialState } from './reducer';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged,
  pageIncidentsChanged,
  sortIncidentsChanged,
  mainCategoryFilterSelectionChanged,
} from './actions';

describe('overviewPageReducer', () => {
  let state;

  beforeEach(() => {
    filterSubcategories.mockImplementation(() => [
      {
        key: '',
        value: 'Alles',
        slug: '',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
        value: 'Dode dieren',
        slug: 'dode-dieren',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/meeuwen',
        value: 'Meeuwen',
        slug: 'meeuwen',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren',
        value: 'Overig dieren',
        slug: 'overig-dieren',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ratten',
        value: 'Ratten',
        slug: 'ratten',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/wespen',
        value: 'Wespen',
        slug: 'wespen',
      },
    ]);
    state = {};
  });

  it('returns the initial state', () => {
    expect(overviewPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the REQUEST_INCIDENTS', () => {
    const action = requestIncidents({});
    const expected = {
      loading: true,
      error: false,
    };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_INICDENTS_SUCCESS', () => {
    const payload = { count: 1, results: [1] };
    const action = requestIncidentsSuccess(payload);
    const expected = {
      incidents: payload.results,
      incidentsCount: payload.count,
      loading: false,
    };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_INCIDENTS_ERROR', () => {
    const message = '';
    const action = requestIncidentsError(message);
    const expected = {
      error: message,
      loading: false,
    };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the INCIDENT_SELECTED', () => {
    const incident = {};
    const action = incidentSelected(incident);
    const expected = {};
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the FILTER_INCIDENTS_CHANGED', () => {
    const filter = {};
    const action = filterIncidentsChanged(filter);
    const expected = {
      filter,
      page: 1,
    };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the PAGE_INCIDENTS_CHANGED', () => {
    const page = 1;
    const action = pageIncidentsChanged(page);
    const expected = { page: 1 };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the SORT_INCIDENTS_CHANGED', () => {
    const sort = '-created_at';
    const action = sortIncidentsChanged(sort);
    const expected = { page: 1, sort };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the MAIN_CATEGORY_FILTER_SELECTION_CHANGED', () => {
    const payload = { selectedOptions: ['overlast-van-dieren'], categories: {} };
    const action = mainCategoryFilterSelectionChanged(payload);
    const expected = {
      filterSubCategoryList: filterSubcategories(action.payload.selectedOptions, action.payload.categories),
    };
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });
});
