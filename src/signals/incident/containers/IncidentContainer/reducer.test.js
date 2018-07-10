
import { fromJS } from 'immutable';
import incidentContainerReducer, { initialState } from './reducer';

describe('incidentContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
