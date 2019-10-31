import { fromJS } from 'immutable';
import reducer, { initialState } from '../reducer';
import {
  APPLY_FILTER,
  CLEAR_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  ORDERING_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
  REMOVE_FILTER_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
} from '../constants';

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

describe('signals/incident-management/reducer', () => {
  it('should return the initial state', () => {
    const defaultAction = {
      type: 'SOME_UNSUPPORTED_TYPE',
    };

    expect(reducer(initialState, defaultAction)).toEqual(initialState);
    expect(reducer(undefined, defaultAction)).toEqual(initialState);
  });

  it('should handle GET_FILTERS_SUCCESS', () => {
    const getFiltersSuccess = {
      type: GET_FILTERS_SUCCESS,
      payload: filters,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('filters', fromJS(filters));

    expect(reducer(initialState, getFiltersSuccess)).toEqual(expected);
    expect(reducer(undefined, getFiltersSuccess)).toEqual(expected);
  });

  it('should handle GET_FILTERS_FAILED', () => {
    const message = 'Could not retrieve!';
    const getFiltersFailed = {
      type: GET_FILTERS_FAILED,
      payload: message,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('error', true)
      .set('errorMessage', message);

    expect(reducer(initialState, getFiltersFailed)).toEqual(expected);
    expect(reducer(undefined, getFiltersFailed)).toEqual(expected);
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

    const expected = fromJS(initialState).set(
      'activeFilter',
      fromJS(appliedFilter),
    );

    expect(reducer(initialState, applyFilter)).toEqual(expected);
    expect(reducer(undefined, applyFilter)).toEqual(expected);
  });

  it('should handle EDIT_FILTER', () => {
    const filterMarkedForEdit = filters[1];
    const editFilter = {
      type: EDIT_FILTER,
      payload: filterMarkedForEdit,
    };

    const expected = fromJS(initialState).set(
      'editFilter',
      fromJS(filterMarkedForEdit),
    );

    expect(reducer(initialState, editFilter)).toEqual(expected);
    expect(reducer(undefined, editFilter)).toEqual(expected);
  });

  it('should handle SAVE_FILTER_FAILED', () => {
    const filterSaveFailed = {
      type: SAVE_FILTER_FAILED,
      payload: errorMessage,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('error', true)
      .set('errorMessage', errorMessage);

    expect(reducer(initialState, filterSaveFailed)).toEqual(expected);
    expect(reducer(undefined, filterSaveFailed)).toEqual(expected);
  });

  it('should handle SAVE_FILTER_SUCCESS', () => {
    const filterSaveSuccess = {
      type: SAVE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', undefined)
      .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterSaveSuccess)).toEqual(expected);
    expect(reducer(undefined, filterSaveSuccess)).toEqual(expected);
  });

  it('should handle UPDATE_FILTER_SUCCESS', () => {
    const filterUpdatedSuccess = {
      type: UPDATE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', undefined)
      .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterUpdatedSuccess)).toEqual(expected);
    expect(reducer(undefined, filterUpdatedSuccess)).toEqual(expected);
  });

  it('should handle UPDATE_FILTER_FAILED', () => {
    const filterUpdatedFailed = {
      type: UPDATE_FILTER_FAILED,
      payload: errorMessage,
    };

    const expected = fromJS(initialState)
      .set('loading', false)
      .set('error', true)
      .set('errorMessage', errorMessage);

    expect(reducer(initialState, filterUpdatedFailed)).toEqual(expected);
    expect(reducer(undefined, filterUpdatedFailed)).toEqual(expected);
  });

  it('should handle CLEAR_FILTER', () => {
    const clearFilter = {
      type: CLEAR_FILTER,
    };

    const expected = fromJS(initialState)
      .set('editFilter', initialState.get('editFilter'))
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', undefined);

    expect(reducer(initialState, clearFilter)).toEqual(expected);
    expect(reducer(undefined, clearFilter)).toEqual(expected);
  });

  it('should handle FILTER_EDIT_CANCELED', () => {
    const filterEditCanceled = {
      type: FILTER_EDIT_CANCELED,
    };

    initialState.set('activeFilter', activeFilter);

    const expected = fromJS(initialState)
      .set('editFilter', initialState.get('activeFilter'));

    expect(reducer(initialState, filterEditCanceled)).toEqual(expected);
    expect(reducer(undefined, filterEditCanceled)).toEqual(expected);
  });

  it('should handle PAGE_INCIDENTS_CHANGED', () => {
    const page = 333;
    const pageIncidentsChanged = {
      type: PAGE_INCIDENTS_CHANGED,
      payload: page,
    };

    initialState.set('page', 1);

    const expected = fromJS(initialState)
      .set('page', page);

    expect(reducer(initialState, pageIncidentsChanged)).toEqual(expected);
    expect(reducer(undefined, pageIncidentsChanged)).toEqual(expected);
  });

  it('should handle ORDERING_INCIDENTS_CHANGED', () => {
    const ordering = 'some-arbitrary-ordering';
    const orderingIncidentsChanged = {
      type: ORDERING_INCIDENTS_CHANGED,
      payload: ordering,
    };

    initialState.set('page', 2).set('ordering', 'Foo bar baz');

    const expected = fromJS(initialState)
      .set('page', 1)
      .set('ordering', ordering);

    expect(reducer(initialState, orderingIncidentsChanged)).toEqual(expected);
    expect(reducer(undefined, orderingIncidentsChanged)).toEqual(expected);
  });
});
