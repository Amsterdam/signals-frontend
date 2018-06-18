
import { fromJS } from 'immutable';

import overviewPageReducer from './reducer';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged
} from './actions';


describe('overviewPageReducer', () => {
  let state;

  beforeEach(() => {
    state = fromJS({});
  });

  it('returns the initial state', () => {
    state = fromJS({ incidents: [] });
    expect(overviewPageReducer(undefined, {})).toEqual(state);
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
    const incidents = [1];
    const action = requestIncidentsSuccess(incidents);
    const expected = fromJS({})
      .set('incidents', incidents)
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
      .set('filter', filter);
    expect(overviewPageReducer(state, action)).toEqual(expected);
  });
});
