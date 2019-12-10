import { fromJS } from 'immutable';

import overviewPageReducer, { initialState } from './reducer';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  searchIncidents,
  resetSearchIncidents,
} from './actions';

describe('overviewPageReducer', () => {
  let state;

  beforeEach(() => {
    state = fromJS({});
  });

  it('returns the initial state', () => {
    expect(overviewPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the REQUEST_INCIDENTS', () => {
    const action = requestIncidents({});
    const expected = {
      loading: true,
      error: false,
      errorMessage: undefined,
    };
    expect(overviewPageReducer(state, action)).toEqual(fromJS(expected));
  });

  it('should handle the REQUEST_INICDENTS_SUCCESS', () => {
    const payload = { count: 1, results: [1] };
    const action = requestIncidentsSuccess(payload);
    const expected = fromJS({})
      .set('incidents', fromJS(payload.results))
      .set('incidentsCount', payload.count)
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', undefined);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_INCIDENTS_ERROR', () => {
    const message = '';
    const action = requestIncidentsError(message);
    const expected = fromJS({})
      .set('error', true)
      .set('errorMessage', message)
      .set('loading', false);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle SEARCH_INCIDENTS', () => {
    const searchQuery = 'Foo bar bazzzz';
    const action = searchIncidents(searchQuery);
    const expected = fromJS({})
      .set('loading', true)
      .set('error', false)
      .set('errorMessage', undefined)
      .set('searchQuery', searchQuery);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });

  it('should handle RESET_SEARCH_INCIDENTS', () => {
    const action = resetSearchIncidents();
    const expected = fromJS({})
      .set('searchQuery', '');
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });
});
