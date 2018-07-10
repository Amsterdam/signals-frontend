
import { fromJS } from 'immutable';
import incidentStatusContainerReducer, { initialState } from './reducer';

describe('incidentStatusContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentStatusContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
