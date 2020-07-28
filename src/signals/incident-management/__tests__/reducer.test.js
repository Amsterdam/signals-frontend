import { fromJS } from 'immutable';
import incidentsJson from 'utils/__tests__/fixtures/incidents.json';
import reducer, { initialState } from '../reducer';
import {
  APPLY_FILTER,
  CLEAR_EDIT_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_DISTRICTS_FAILED,
  GET_DISTRICTS_SUCCESS,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  ORDERING_CHANGED,
  PAGE_CHANGED,
  REMOVE_FILTER_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  SEARCH_INCIDENTS_SUCCESS,
  SEARCH_INCIDENTS_ERROR,
} from '../constants';
import { RESET_SEARCH_QUERY, SET_SEARCH_QUERY } from '../../../containers/App/constants';

const errorMessage = 'Something went horribly wrong';
const activeFilter = {
  _links: {
    self: {
      href: 'https://signals/v1/private/me/filters/219',
    },
  },
  options: {
    maincategory_slug: ['i', 'o'],
  },
  name: 'Foo Bar',
};

const filters = [
  activeFilter,
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/220',
      },
    },
    options: {
      maincategory_slug: ['i', 'o'],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/221',
      },
    },
    options: {
      maincategory_slug: ['i', 'o'],
    },
    name: 'Foo Bar',
  },
];

const districts = [
  {
    code: 'A',
  },
  {
    code: 'B',
  },
];

const intermediateState = fromJS({
  ...initialState.toJS(),
  activeFilter,
  page: 100,
  error: false,
  ordering: 'stadsdeel,-created_at',
  loading: false,
  incidents: {
    count: incidentsJson.length,
    results: incidentsJson,
  },
});

describe('signals/incident-management/reducer', () => {
  it('should return the initial state', () => {
    const defaultAction = {
      type: 'SOME_UNSUPPORTED_TYPE',
    };

    expect(reducer(initialState, defaultAction)).toEqual(initialState);
    expect(reducer(undefined, defaultAction)).toEqual(initialState);
    expect(reducer(intermediateState, defaultAction)).toEqual(intermediateState);
  });

  it('should not change loading flag when something is still loading', () => {
    const getDistrictsSuccess = {
      type: GET_DISTRICTS_SUCCESS,
      payload: districts,
    };

    const applied = state =>
      state.set('loading', true).set('districtsLoading', false).set('districts', fromJS(districts));
    const initialStateWithFiltersLoading = fromJS({
      ...initialState.toJS(),
      districtsLoading: true,
      filtersLoading: true,
    });
    const intermediateStateWithFiltersLoading = fromJS({
      ...intermediateState.toJS(),
      districtsLoading: true,
      filtersLoading: true,
    });

    expect(reducer(initialStateWithFiltersLoading, getDistrictsSuccess)).toEqual(
      applied(initialStateWithFiltersLoading)
    );
    expect(reducer(intermediateStateWithFiltersLoading, getDistrictsSuccess)).toEqual(
      applied(intermediateStateWithFiltersLoading)
    );
  });

  it('should handle GET_DISTRICTS_SUCCESS', () => {
    const getDistrictsSuccess = {
      type: GET_DISTRICTS_SUCCESS,
      payload: districts,
    };

    const applied = state => state.set('loading', false).set('districts', fromJS(districts));

    expect(reducer(initialState, getDistrictsSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, getDistrictsSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle GET_DISTRICTS_FAILED', () => {
    const message = 'Could not retrieve!';
    const getDistrictsFailed = {
      type: GET_DISTRICTS_FAILED,
      payload: message,
    };

    const applied = state => state.set('loading', false).set('error', true).set('errorMessage', message);

    expect(reducer(initialState, getDistrictsFailed)).toEqual(applied(initialState));
    expect(reducer(intermediateState, getDistrictsFailed)).toEqual(applied(intermediateState));
  });

  it('should handle GET_FILTERS_SUCCESS', () => {
    const getFiltersSuccess = {
      type: GET_FILTERS_SUCCESS,
      payload: filters,
    };

    const applied = state => state.set('loading', false).set('filters', fromJS(filters));

    expect(reducer(initialState, getFiltersSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, getFiltersSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle GET_FILTERS_FAILED', () => {
    const message = 'Could not retrieve!';
    const getFiltersFailed = {
      type: GET_FILTERS_FAILED,
      payload: message,
    };

    const applied = state => state.set('loading', false).set('error', true).set('errorMessage', message);

    expect(reducer(initialState, getFiltersFailed)).toEqual(applied(initialState));
    expect(reducer(intermediateState, getFiltersFailed)).toEqual(applied(intermediateState));
  });

  it('should handle REMOVE_FILTER_SUCCESS', () => {
    const filterId = 220;
    const removeFilterSuccess = {
      type: REMOVE_FILTER_SUCCESS,
      payload: filterId,
    };

    const getFiltersSuccess = {
      type: GET_FILTERS_SUCCESS,
      payload: filters,
    };
    const state = reducer(initialState, getFiltersSuccess);
    const response = reducer(state, removeFilterSuccess);
    expect(response.toJS().filters).toEqual([filters[0], filters[2]]);
  });

  it('should handle APPLY_FILTER', () => {
    const appliedFilter = filters[2];
    const applyFilter = {
      type: APPLY_FILTER,
      payload: appliedFilter,
    };

    const applied = state =>
      state
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'))
        .set('activeFilter', fromJS(appliedFilter))
        .set('editFilter', fromJS(appliedFilter));

    expect(reducer(initialState, applyFilter)).toEqual(applied(initialState));
    expect(reducer(intermediateState, applyFilter)).toEqual(applied(intermediateState));
  });

  it('should handle EDIT_FILTER', () => {
    const filterMarkedForEdit = filters[1];
    const editFilter = {
      type: EDIT_FILTER,
      payload: filterMarkedForEdit,
    };

    const applied = state => state.set('editFilter', fromJS(filterMarkedForEdit));

    expect(reducer(initialState, editFilter)).toEqual(applied(initialState));
    expect(reducer(intermediateState, editFilter)).toEqual(applied(intermediateState));
  });

  it('should handle SAVE_FILTER_FAILED', () => {
    const filterSaveFailed = {
      type: SAVE_FILTER_FAILED,
      payload: errorMessage,
    };

    const applied = state => state.set('loading', false).set('error', true).set('errorMessage', errorMessage);

    expect(reducer(initialState, filterSaveFailed)).toEqual(applied(initialState));
    expect(reducer(intermediateState, filterSaveFailed)).toEqual(applied(intermediateState));
  });

  it('should handle SAVE_FILTER_SUCCESS', () => {
    const filterSaveSuccess = {
      type: SAVE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const applied = state =>
      state
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined)
        .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterSaveSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, filterSaveSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle UPDATE_FILTER_SUCCESS', () => {
    const filterUpdatedSuccess = {
      type: UPDATE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const applied = state =>
      state
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined)
        .set('activeFilter', fromJS(filterUpdatedSuccess.payload));

    expect(reducer(initialState, filterUpdatedSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, filterUpdatedSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle UPDATE_FILTER_FAILED', () => {
    const filterUpdatedFailed = {
      type: UPDATE_FILTER_FAILED,
      payload: errorMessage,
    };

    const applied = state => state.set('loading', false).set('error', true).set('errorMessage', errorMessage);

    expect(reducer(initialState, filterUpdatedFailed)).toEqual(applied(initialState));
    expect(reducer(intermediateState, filterUpdatedFailed)).toEqual(applied(intermediateState));
  });

  it('should handle CLEAR_EDIT_FILTER', () => {
    const clearEditFilter = {
      type: CLEAR_EDIT_FILTER,
    };

    const someState = fromJS({
      ...initialState.toJS(),
      editFilter: {
        name: 'Foo bar baz',
        options: {
          created_after: '2019-18-12T00:00:00',
        },
      },
      page: 1,
      ordering: '-created_at',
    });

    const applied = state =>
      state
        .set('editFilter', initialState.get('editFilter'))
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined);

    expect(reducer(initialState, clearEditFilter)).toEqual(applied(initialState));
    expect(reducer(someState, clearEditFilter)).toEqual(applied(someState));
  });

  it('should handle FILTER_EDIT_CANCELED', () => {
    const filterEditCanceled = {
      type: FILTER_EDIT_CANCELED,
    };

    const applied = state => state.set('editFilter', state.get('activeFilter'));

    expect(reducer(initialState, filterEditCanceled)).toEqual(applied(initialState));
    expect(reducer(intermediateState, filterEditCanceled)).toEqual(applied(intermediateState));
  });

  it('should handle PAGE_CHANGED', () => {
    const page = 333;
    const pageChanged = {
      type: PAGE_CHANGED,
      payload: page,
    };

    const applied = state => state.set('page', page);

    expect(reducer(initialState, pageChanged)).toEqual(applied(initialState));
    expect(reducer(intermediateState, pageChanged)).toEqual(applied(intermediateState));
  });

  it('should handle ORDERING_CHANGED', () => {
    const ordering = 'some-arbitrary-ordering';
    const orderingChanged = {
      type: ORDERING_CHANGED,
      payload: ordering,
    };

    const applied = state => state.set('page', 1).set('ordering', ordering);

    expect(reducer(initialState, orderingChanged)).toEqual(applied(initialState));
    expect(reducer(intermediateState, orderingChanged)).toEqual(applied(intermediateState));
  });

  it('should handle REQUEST_INCIDENTS', () => {
    const requestIncidents = {
      type: REQUEST_INCIDENTS,
    };

    const applied = state =>
      state.set('loading', true).set('incidentsLoading', true).set('error', false).set('errorMessage', undefined);

    expect(reducer(initialState, requestIncidents)).toEqual(applied(initialState));
    expect(reducer(intermediateState, requestIncidents)).toEqual(applied(intermediateState));
  });

  it('should handle REQUEST_INCIDENTS_SUCCESS', () => {
    const requestIncidentsSuccess = {
      type: REQUEST_INCIDENTS_SUCCESS,
      payload: incidentsJson,
    };

    const applied = state =>
      state
        .set('incidents', fromJS(requestIncidentsSuccess.payload))
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined);

    expect(reducer(initialState, requestIncidentsSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, requestIncidentsSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle the REQUEST_INCIDENTS_ERROR', () => {
    const error = new Error('Whoop!!1!');
    const requestIncidentsError = {
      type: REQUEST_INCIDENTS_ERROR,
      payload: error.message,
    };

    const applied = state => state.set('error', true).set('errorMessage', error.message).set('loading', false);

    expect(reducer(initialState, requestIncidentsError)).toEqual(applied(initialState));
    expect(reducer(intermediateState, requestIncidentsError)).toEqual(applied(intermediateState));
  });

  it('should handle SEARCH_INCIDENTS_SUCCESS', () => {
    const searchIncidentsSuccess = {
      type: SEARCH_INCIDENTS_SUCCESS,
      payload: incidentsJson,
    };

    const applied = state =>
      state
        .set('incidents', fromJS(searchIncidentsSuccess.payload))
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined);

    expect(reducer(initialState, searchIncidentsSuccess)).toEqual(applied(initialState));
    expect(reducer(intermediateState, searchIncidentsSuccess)).toEqual(applied(intermediateState));
  });

  it('should handle SEARCH_INCIDENTS_ERROR', () => {
    const error = new Error('Whoop!!1!');
    const searchIncidentsError = {
      type: SEARCH_INCIDENTS_ERROR,
      payload: error.message,
    };

    const applied = state => state.set('error', true).set('errorMessage', error.message).set('loading', false);

    expect(reducer(initialState, searchIncidentsError)).toEqual(applied(initialState));
    expect(reducer(intermediateState, searchIncidentsError)).toEqual(applied(intermediateState));
  });

  it('should handle SET_SEARCH_QUERY', () => {
    const setSearchQuery = {
      type: SET_SEARCH_QUERY,
      payload: 'stoeptegels',
    };

    const applied = state =>
      state
        .set('loading', true)
        .set('incidentsLoading', true)
        .set('activeFilter', initialState.get('activeFilter'))
        .set('editFilter', initialState.get('editFilter'))
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'));

    expect(reducer(initialState, setSearchQuery)).toEqual(applied(initialState));
    expect(reducer(intermediateState, setSearchQuery)).toEqual(applied(intermediateState));
  });

  it('should handle RESET_SEARCH_QUERY', () => {
    const resetSearchQuery = {
      type: RESET_SEARCH_QUERY,
    };

    const applied = state =>
      state
        .set('loading', true)
        .set('incidentsLoading', true)
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'));

    expect(reducer(initialState, resetSearchQuery)).toEqual(applied(initialState));
    expect(reducer(intermediateState, resetSearchQuery)).toEqual(applied(intermediateState));
  });
});
