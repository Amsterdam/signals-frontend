
import { fromJS } from 'immutable';
import incidentDetailPageReducer, { initialState } from './reducer';

describe('incidentDetailPageReducer', () => {
  it('returns the initial state', () => {
    expect(incidentDetailPageReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
