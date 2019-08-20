
import { fromJS } from 'immutable';

import overviewPageReducer, { initialState } from './reducer';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged,
  pageIncidentsChanged,
  sortIncidentsChanged,
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
});
